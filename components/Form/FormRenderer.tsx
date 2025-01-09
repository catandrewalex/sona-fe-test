/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cancel, Save } from "@mui/icons-material";
import { TextFieldProps } from "@mui/material";
import { DatePickerProps, DateTimePickerProps } from "@mui/x-date-pickers";
import Form from "@sonamusica-fe/components/Form";
import DatePicker from "@sonamusica-fe/components/Form/DatePicker";
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
import { merge } from "lodash";
import { Moment } from "moment";
import React, { useRef, useState } from "react";
import DateTimePicker from "@sonamusica-fe/components/Form/DateTimePicker";

type FormFieldType = "text" | "select" | "switch" | "custom" | "date" | "date-time";

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

interface FormFieldDate<T> extends BaseFormField<T> {
  type: "date";
  dateProps?: Omit<DatePickerProps<Moment>, "label">;
}

interface FormFieldDateTime<T> extends BaseFormField<T> {
  type: "date-time";
  dateProps?: Omit<DateTimePickerProps<Moment>, "label">;
}

export type FormField<T> =
  | FormFieldText<T>
  | FormFieldSelect<T>
  | FormFieldSwitch<T>
  | FormFieldCustom<T>
  | FormFieldDate<T>
  | FormFieldDateTime<T>;

export interface FormConfig<T> {
  fields: Array<FormField<T>>;
  formSpacing?: FormSpacingType;
  submitContainerProps?: Omit<SubmitButtonContainerProps, "children">;
  submitButtonProps?: Omit<SubmitButtonProps, "children">;
  cancelButtonProps?: Omit<SubmitButtonProps, "children">;
  disablePromptCancelButtonDialog?: boolean;
  submitHandler: (data: T, errors: Record<keyof T, string>) => Promise<void | FailedResponse>;
  errorResponseMapping?: Partial<Record<keyof T, string>>;
  testIdContext?: string;
  disableUseOfDefaultFormConfig?: boolean;
  disableLoading?: boolean;
}

export enum FormSpacingType {
  NORMAL = "NORMAL",
  COMPACT = "COMPACT"
}

const formSpacingValues = {
  NORMAL: { columnSpacing: 3, rowSpacing: 3 },
  COMPACT: { columnSpacing: 2, rowSpacing: 0.5 }
};

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

    const { columnSpacing, rowSpacing } = formSpacingValues[config?.formSpacing ?? "NORMAL"];

    return (
      <Form
        rowSpacing={rowSpacing}
        columnSpacing={columnSpacing}
        onSubmit={(e) => {
          if (!config.disableLoading) {
            setLoading(true);
          }

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
            .catch(console.error)
            .finally(() => setLoading(false));
        }}
        formSubmit={
          <SubmitButtonContainer
            {...(!config.disableUseOfDefaultFormConfig
              ? merge({ align: "space-between", spacing: 3 }, config.submitContainerProps)
              : config.submitContainerProps)}
          >
            {(config.cancelButtonProps || !config.disableUseOfDefaultFormConfig) && (
              <SubmitButton
                align="center"
                regular
                variant="outlined"
                color="error"
                submitText="Cancel"
                fullWidth
                disabled={loading}
                testIdContext={(config.testIdContext || "") + "Cancel"}
                {...(!config.disableUseOfDefaultFormConfig
                  ? merge({ startIcon: <Cancel /> }, config.cancelButtonProps)
                  : config.cancelButtonProps)}
                onClick={(e) => {
                  if (!config.disablePromptCancelButtonDialog && hasUnsavedChangesRef.current) {
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
              {...(!config.disableUseOfDefaultFormConfig
                ? merge({ endIcon: <Save /> }, config.submitButtonProps)
                : config.submitButtonProps)}
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
                    disabled={loading}
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
            case "date":
              return (
                <FormField key={field.name as string} {...field.formFieldProps}>
                  <DatePicker
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    field={field.name}
                    disabled={loading}
                    validations={field.validations}
                    testIdContext={(config.testIdContext || "") + titleCase(field.name.toString())}
                    {...field.dateProps}
                    onChange={(value, context) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.dateProps?.onChange) field.dateProps.onChange(value, context);
                    }}
                  />
                </FormField>
              );
            case "date-time":
              return (
                <FormField key={field.name as string} {...field.formFieldProps}>
                  <DateTimePicker
                    valueRef={valueRef}
                    errorRef={errorRef}
                    label={field.label}
                    field={field.name}
                    disabled={loading}
                    validations={field.validations}
                    testIdContext={(config.testIdContext || "") + titleCase(field.name.toString())}
                    {...field.dateProps}
                    onChange={(value, context) => {
                      hasUnsavedChangesRef.current = true;
                      if (field.dateProps?.onChange) field.dateProps.onChange(value, context);
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
