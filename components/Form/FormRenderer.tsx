/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFieldProps } from "@mui/material";
import Form from "@sonamusica-fe/components/Form";
import FormField, { FormFieldTypes } from "@sonamusica-fe/components/Form/FormField";
import Select, { SelectProps } from "@sonamusica-fe/components/Form/Select";
import SubmitButton, { SubmitButtonProps } from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer, {
  SubmitButtonContainerProps
} from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import TextInput, { TextInputProps } from "@sonamusica-fe/components/Form/TextInput";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { capitalizeFirstLetter } from "@sonamusica-fe/utils/StringUtil";
import { ValidationConfig } from "@sonamusica-fe/utils/ValidationUtil";
import { FailedResponse } from "api";
import React, { useMemo, useRef, useState } from "react";

interface BaseFormField<T> {
  type: string;
  name: keyof T;
  label: string;
  validations: Array<ValidationConfig<T>>;
  formFieldProps?: Omit<FormFieldTypes, "children">;
}

interface FormFieldText<T> extends BaseFormField<T> {
  type: "text";
  inputProps?: Omit<TextInputProps<T>, "valueRef" | "errorRef" | "field" | "label">;
}

interface FormFieldSelect<T> extends BaseFormField<T> {
  type: "select";
  multiple?: boolean;
  selectProps: Omit<SelectProps<any, T>, "valueRef" | "errorRef" | "field" | "label">;
  inputProps?: TextFieldProps;
}

export type FormField<T> = FormFieldText<T> | FormFieldSelect<T>;

export interface FormConfig<T> {
  fields: Array<FormField<T>>;
  submitContainerProps?: Omit<SubmitButtonContainerProps, "children">;
  submitButtonProps?: Omit<SubmitButtonProps, "children">;
  cancelButtonProps?: Omit<SubmitButtonProps, "children">;
  promptCancelButtonDialog?: boolean;
  submitHandler: (data: T, errors: Record<keyof T, string>) => Promise<void | FailedResponse>;
  errorResponseMapping?: Partial<Record<keyof T, string>>;
}

export interface FormProperties<T> {
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
  hasUnsavedChangesRef: React.MutableRefObject<boolean>;
}

const useFormRenderer = <T extends unknown>(
  config: FormConfig<T>,
  emptyValue: T
): { formProperties: FormProperties<T>; formRenderer: () => JSX.Element } => {
  const valueRef = useRef<T>({} as T);
  const errorRef = useRef<Record<keyof T, string>>({} as Record<keyof T, string>);
  const hasUnsavedChangesRef = useRef<boolean>(false);

  const formRenderer = (): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);

    const showDialog = useMemo(() => {
      const temp = useAlertDialog();
      return temp.showDialog;
    }, []);

    return (
      <Form
        onSubmit={() => {
          setLoading(true);

          config
            .submitHandler(valueRef.current, errorRef.current)
            .then((response) => {
              if (
                config.errorResponseMapping &&
                Object.getPrototypeOf(response) === FailedResponse.prototype
              ) {
                Object.entries((response as FailedResponse).errors).forEach((error) => {
                  const mappingFound = Object.entries(
                    config.errorResponseMapping as Record<keyof T, string>
                  ).filter((mapping) => error[0].includes(mapping[1] as string));
                  if (mappingFound.length > 0) {
                    const idx = error[1].indexOf(mappingFound[0][1] as string);
                    const errorText = error[1].substring(idx);
                    errorRef.current[mappingFound[0][0] as keyof T] =
                      capitalizeFirstLetter(errorText);
                  }
                });
              }
            })
            .catch(() => null)
            .finally(() => setLoading(false));
        }}
        formSubmit={
          <SubmitButtonContainer {...config.submitContainerProps}>
            {config.cancelButtonProps && (
              <SubmitButton
                align="center"
                regular
                variant="outlined"
                color="error"
                submitText="Cancel"
                fullWidth
                disabled={loading}
                {...config.cancelButtonProps}
                onClick={(e) => {
                  if (config.promptCancelButtonDialog && hasUnsavedChangesRef.current) {
                    showDialog(
                      {
                        title: "Unsaved Changes",
                        content: "Your changes will be lost. Proceed?"
                      },
                      () => {
                        if (config.cancelButtonProps?.onClick) config.cancelButtonProps?.onClick(e);
                        hasUnsavedChangesRef.current = false;
                        valueRef.current = emptyValue;
                        errorRef.current = {} as Record<keyof T, string>;
                      }
                    );
                  } else {
                    if (config.cancelButtonProps?.onClick) config.cancelButtonProps?.onClick(e);
                    hasUnsavedChangesRef.current = false;
                    valueRef.current = emptyValue;
                    errorRef.current = {} as Record<keyof T, string>;
                  }
                }}
              />
            )}
            <SubmitButton
              fullWidth
              loading={loading}
              submitText="Submit"
              {...config.submitButtonProps}
            />
          </SubmitButtonContainer>
        }
      >
        {config.fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <FormField {...field.formFieldProps}>
                  <TextInput
                    field={field.name}
                    validations={field.validations}
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    disabled={loading}
                    initialValue={valueRef.current[field.name]}
                    {...field.inputProps}
                    onChange={(e) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.inputProps?.onChange) field.inputProps.onChange(e);
                    }}
                  />
                </FormField>
              );
            case "select":
              return (
                <FormField {...field.formFieldProps}>
                  <Select
                    disabled={loading}
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    field={field.name}
                    validations={field.validations}
                    inputProps={field.inputProps}
                    initialValue={valueRef.current[field.name]}
                    {...field.selectProps}
                    onChange={(_valuRefIgnored, _errorRefIgnored, e, value, reason) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.selectProps?.onChange)
                        field.selectProps.onChange(valueRef, errorRef, e, value, reason);
                    }}
                  />
                </FormField>
              );
          }
        })}
      </Form>
    );
  };
  return {
    formProperties: { valueRef, errorRef, hasUnsavedChangesRef },
    formRenderer
  };
};

export default useFormRenderer;
