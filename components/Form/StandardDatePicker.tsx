import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { Moment } from "moment/moment";
import { merge } from "lodash";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import React, { useEffect, useState } from "react";
import { DatePickerProps } from "@mui/x-date-pickers";

const errorMapping: Record<string, string> = {
  disableFuture: "Date can not point to a future date",
  minDate: "Please select a date after the year of 1900",
  invalidDate: "Date is invalid"
};

const StandardDatePicker = ({
  defaultValue,
  onChange,
  ...props
}: Omit<DatePickerProps<Moment>, "value"> & {
  required?: boolean;
  markError?: (isError: boolean) => void;
}) => {
  const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");
  const [internalValue, setInternalValue] = useState<Moment | null>(defaultValue ?? null);

  return (
    <>
      <MuiDatePicker<Moment>
        value={internalValue}
        label={props.label}
        onChange={(value, context) => {
          setInternalValue(value);
          if (value === null && props.required) {
            setInternalErrorMsg(`${props.label} is required!`);
            if (props.markError) props.markError(true);
          } else {
            setInternalErrorMsg("");
            if (props.markError) props.markError(false);
            if (onChange) onChange(value, context);
          }
        }}
        slotProps={merge(
          {
            textField: { fullWidth: true, margin: "normal", required: true },
            actionBar: {
              actions: ["today", "clear"]
            }
          },
          props.slotProps
        )}
        disableFuture
        {...props}
        onError={(error, value) => {
          if (error) {
            const errorStr = errorMapping[error.toString()];
            setInternalErrorMsg(errorStr);
            if (props.markError) props.markError(true);
          }
          if (props.onError) props.onError(error, value);
        }}
      />
      {internalErrorMsg !== "" && <FormFeedback message={internalErrorMsg} error />}
    </>
  );
};

export default StandardDatePicker;
