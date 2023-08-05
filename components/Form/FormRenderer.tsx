/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFieldProps } from "@mui/material";
import Form from "@sonamusica-fe/components/Form";
import FormField, { FormFieldTypes } from "@sonamusica-fe/components/Form/FormField";
import Select, { SelectProps } from "@sonamusica-fe/components/Form/Select";
import SubmitButton, { SubmitButtonProps } from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer, {
  SubmitButtonContainerProps
} from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import Switch, { SwitchProps } from "@sonamusica-fe/components/Form/Switch";
import TextInput, { TextInputProps } from "@sonamusica-fe/components/Form/TextInput";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { capitalizeFirstLetter, titleCase } from "@sonamusica-fe/utils/StringUtil";
import { ValidationConfig } from "@sonamusica-fe/utils/ValidationUtil";
import { FailedResponse } from "api";
import React, { useRef, useState } from "react";

type FormFieldType = "text" | "select" | "switch" | "custom";

interface BaseFormField<T> {
  type: FormFieldType;
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

interface FormFieldSwitch<T> extends BaseFormField<T> {
  type: "switch";
  inputProps?: Omit<SwitchProps<T>, "valueRef" | "errorRef" | "field" | "label" | "validations">;
}

export type FormFieldCustomProps<T> = {
  validations?: Array<ValidationConfig<T>>;
  field: keyof T;
  label: string;
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
};
interface FormFieldCustom<T> extends BaseFormField<T> {
  type: "custom";
  props?: Record<any, any>;
  Component: React.FC<any>;
}

export type FormField<T> =
  | FormFieldText<T>
  | FormFieldSelect<T>
  | FormFieldSwitch<T>
  | FormFieldCustom<T>;

export interface FormConfig<T> {
  fields: Array<FormField<T>>;
  submitContainerProps?: Omit<SubmitButtonContainerProps, "children">;
  submitButtonProps?: Omit<SubmitButtonProps, "children">;
  cancelButtonProps?: Omit<SubmitButtonProps, "children">;
  promptCancelButtonDialog?: boolean;
  submitHandler: (data: T, errors: Record<keyof T, string>) => Promise<void | FailedResponse>;
  errorResponseMapping?: Partial<Record<keyof T, string>>;
  testIdContext?: string;
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
  const valueRef = useRef<T>(emptyValue as T);
  const errorRef = useRef<Record<keyof T, string>>({} as Record<keyof T, string>);
  const hasUnsavedChangesRef = useRef<boolean>(false);

  const formRenderer = (): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const { showDialog } = useAlertDialog();

    return (
      <Form
        onSubmit={(e) => {
          setLoading(true);

          config
            .submitHandler(valueRef.current, errorRef.current)
            .then((response) => {
              if (
                config.errorResponseMapping &&
                response &&
                Object.getPrototypeOf(response) === FailedResponse.prototype
              ) {
                Object.entries((response as FailedResponse).errors).forEach((error) => {
                  const mappingFound = Object.entries(
                    config.errorResponseMapping as Record<keyof T, string>
                  ).filter((mapping) => error[0].includes(mapping[1] as string));
                  if (mappingFound.length > 0) {
                    const idx = error[1].indexOf(mappingFound[0][1] as string);
                    const errorText = error[1].substring(idx);
                    errorRef.current[mappingFound[0][0] as keyof T] = capitalizeFirstLetter(
                      errorText
                    ).replace("Id", "");
                  }
                });
              } else {
                if (config.cancelButtonProps?.onClick)
                  config.cancelButtonProps?.onClick(
                    e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
                  );
                hasUnsavedChangesRef.current = false;
                valueRef.current = emptyValue;
                errorRef.current = {} as Record<keyof T, string>;
              }
            })
            .catch(console.log)
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
                testIdContext={(config.testIdContext || "") + "Cancel"}
                {...config.cancelButtonProps}
                onClick={(e) => {
                  if (config.promptCancelButtonDialog && hasUnsavedChangesRef.current) {
                    showDialog(
                      {
                        title: "Unsaved Changes",
                        content: "Your changes will be lost. Proceed?",
                        positiveTestIdContext: config.testIdContext,
                        negativeTestIdContext: config.testIdContext
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
              testIdContext={(config.testIdContext || "") + "Submit"}
              {...config.submitButtonProps}
            />
          </SubmitButtonContainer>
        }
      >
        {config.fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <FormField key={field.name as string} {...field.formFieldProps}>
                  <TextInput
                    field={field.name}
                    validations={field.validations}
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    disabled={loading}
                    initialValue={valueRef.current[field.name]}
                    testIdContext={(config.testIdContext || "") + titleCase(field.name.toString())}
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
                <FormField key={field.name as string} {...field.formFieldProps}>
                  <Select
                    disabled={loading}
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    field={field.name}
                    validations={field.validations}
                    inputProps={field.inputProps}
                    initialValue={valueRef.current[field.name]}
                    testIdContext={(config.testIdContext || "") + titleCase(field.name.toString())}
                    {...field.selectProps}
                    onChange={(_valuRefIgnored, _errorRefIgnored, e, value, reason) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.selectProps?.onChange)
                        field.selectProps.onChange(valueRef, errorRef, e, value, reason);
                    }}
                  />
                </FormField>
              );
            case "switch":
              return (
                <FormField key={field.name as string} {...field.formFieldProps}>
                  <Switch
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    field={field.name}
                    validations={field.validations}
                    testIdContext={(config.testIdContext || "") + titleCase(field.name.toString())}
                    {...field.inputProps}
                    onChange={(e, checked) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.inputProps?.onChange) field.inputProps.onChange(e, checked);
                    }}
                  />
                </FormField>
              );
            case "custom":
              return (
                <FormField key={field.name as string} {...field.formFieldProps}>
                  <field.Component
                    {...field.props}
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    field={field.name}
                    validations={field.validations}
                    testIdContext={(config.testIdContext || "") + titleCase(field.name.toString())}
                    onChange={(e: any) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.props?.onChange) field.props.onChange(e);
                    }}
                  ></field.Component>
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
