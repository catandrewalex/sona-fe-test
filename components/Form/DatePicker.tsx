/* eslint-disable react/destructuring-assignment */
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { useCallback, useEffect, useState } from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { ValidationConfig } from "@sonamusica-fe/utils/ValidationUtil";
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps
} from "@mui/x-date-pickers/DatePicker";
import moment, { Moment } from "moment";

const errorMapping: Record<string, string> = {
  disableFuture: "Date can not point to a future date",
  minDate: "Please select a date after the year of 1900",
  invalidDate: "Date is invalid"
};

export type DatePickerProps<T> = {
  testIdContext?: string;
  validations?: Array<ValidationConfig<T>>;
  field: keyof T;
  label: string;
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
} & Exclude<MuiDatePickerProps<Moment>, "value">;

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
          if (onChange) onChange(value, context);
          valueRef.current[field] = realValue as T[keyof T];
        }}
        slotProps={{ textField: { fullWidth: true } }}
        disableFuture
        {...props}
        onError={(error) => {
          if (error) {
            const errorStr = errorMapping[error.toString()];
            setInternalErrorMsg(errorStr);
            errorRef.current[field] = errorStr;
          } else {
            setInternalErrorMsg("");
            errorRef.current[field] = "";
          }
        }}
      />
      {internalErrorMsg !== "" && (
        <FormFeedback message={internalErrorMsg} error testIdContext={testIdContext} />
      )}
    </>
  );
};

export default DatePicker;
