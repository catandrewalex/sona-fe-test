/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { ValidationConfig } from "@sonamusica-fe/utils/ValidationUtil";
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps
} from "@mui/x-date-pickers/DateTimePicker";
import moment, { Moment } from "moment";
import { merge } from "lodash";

const errorMapping: Record<string, string> = {
  disableFuture: "Date can not point to a future date",
  minDate: "Please select a date after the year of 1900",
  invalidDate: "Date is invalid"
};

export type DateTimePickerProps<T> = {
  testIdContext?: string;
  validations?: Array<ValidationConfig<T>>;
  field: keyof T;
  label: string;
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
} & Exclude<MuiDateTimePickerProps<Moment>, "value">;

const DateTimePicker = <T extends unknown>({
  testIdContext,
  field,
  label,
  valueRef,
  errorRef,
  onChange,
  defaultValue,
  slotProps,
  ...props
}: DateTimePickerProps<T>): JSX.Element => {
  const [internalValue, setInternalValue] = useState<Moment | null>(null);
  const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");

  useEffect(() => {
    setInternalValue((valueRef.current[field] as unknown as Moment) || moment());
  }, [valueRef.current[field]]);

  useEffect(() => {
    if (errorRef.current[field] !== undefined && errorRef.current[field] !== internalErrorMsg) {
      setInternalErrorMsg(errorRef.current[field]);
    }
  }, [errorRef.current[field]]);

  useEffect(() => {
    if (defaultValue) {
      setInternalValue(defaultValue);
      valueRef.current[field] = defaultValue as unknown as T[keyof T];
    }
  }, [defaultValue]);

  return (
    <>
      <MuiDateTimePicker<Moment>
        value={internalValue}
        label={label}
        format="DD/MM/YYYY HH:mm"
        ampm={false}
        onChange={(value, context) => {
          setInternalValue(value);
          if (onChange) onChange(value, context);
          valueRef.current[field] = value as unknown as T[keyof T];
        }}
        slotProps={merge(
          {
            textField: { fullWidth: true, margin: "normal" },
            actionBar: {
              actions: ["today", "clear"]
            }
          },
          slotProps
        )}
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

export default DateTimePicker;
