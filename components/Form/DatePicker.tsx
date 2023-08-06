/* eslint-disable react/destructuring-assignment */
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { useCallback, useEffect, useState } from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { InputAdornment } from "@mui/material";
import { ValidationConfig, useCheckRequired } from "@sonamusica-fe/utils/ValidationUtil";
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps
} from "@mui/x-date-pickers/DatePicker";
import moment, { Moment } from "moment";

export type DatePickerProps<T> = {
  testIdContext?: string;
  validations?: Array<ValidationConfig<T>>;
  field: keyof T;
  label: string;
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
} & Exclude<MuiDatePickerProps<Moment>, "value">;

/**
 * Input component for text.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props DatePickerProps
 */
const DatePicker = <T extends unknown>({
  testIdContext,
  validations,
  field,
  label,
  valueRef,
  errorRef,
  onChange,
  ...props
}: DatePickerProps<T>): JSX.Element => {
  const [internalValue, setInternalValue] = useState<Moment | null>(null);
  const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");

  const requiredCheck = useCheckRequired(label);

  const validationHandler = useCallback(
    (value: string) => {
      if (validations) {
        for (const validation of validations) {
          let errorMsg = "";
          switch (validation.name) {
            case "required":
              errorMsg = requiredCheck(value);
              break;
          }
          if (errorMsg) {
            setInternalErrorMsg(errorMsg);
            return errorMsg;
          }
        }
      }
      setInternalErrorMsg("");
      return "";
    },
    [validations]
  );

  useEffect(() => {
    setInternalValue(moment(valueRef.current[field] as string) || moment());
  }, [valueRef.current[field]]);

  useEffect(() => {
    if (errorRef.current[field] !== undefined && errorRef.current[field] !== internalErrorMsg) {
      setInternalErrorMsg(errorRef.current[field]);
    }
  }, [errorRef.current[field]]);

  return (
    <>
      <MuiDatePicker<Moment>
        value={internalValue}
        label={label}
        onChange={(value, context) => {
          const realValue = value ? moment(value).format() : "";
          setInternalValue(value);
          errorRef.current[field] = validationHandler(realValue);
          if (onChange) onChange(value, context);
          valueRef.current[field] = realValue as T[keyof T];
        }}
        disableFuture
        {...props}
      />
      {internalErrorMsg !== "" && (
        <FormFeedback message={internalErrorMsg} error testIdContext={testIdContext} />
      )}
    </>
  );
};

export default DatePicker;
