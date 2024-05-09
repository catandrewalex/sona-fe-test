/* eslint-disable react/destructuring-assignment */
import { TextFieldProps } from "@mui/material/TextField";
import React, { useCallback, useEffect, useState } from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { InputAdornment, TextField } from "@mui/material";
import {
  ValidationConfig,
  useCheckEmail,
  useCheckMatch,
  useCheckRequired,
  useCheckNoBelowZeroValue,
  useCheckPositiveNumberValue
} from "@sonamusica-fe/utils/ValidationUtil";

/**
 * Text Input prop types.
 * @typedef {Object} TextInputProps
 * @extends TextFieldProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {string|undefined} errorMsg the error message for this particular form input
 * @property {React.ReactNode|undefined} startAdornment any react component that will appear before the input
 * @property {React.ReactNode|undefined} endAdornment any react component that will appear after the input
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 */
export type TextInputProps<T> = {
  testIdContext?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  initialValue?: string;
  validations?: Array<ValidationConfig<T>>;
  field: keyof T;
  label: string;
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
} & Exclude<TextFieldProps, "value">;

/**
 * Input component for text.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props TextInputProps
 */
const TextInput = <T extends unknown>({
  testIdContext,
  startAdornment,
  endAdornment,
  inputProps,
  initialValue,
  validations,
  field,
  label,
  valueRef,
  errorRef,
  onChange,
  ...props
}: TextInputProps<T>): JSX.Element => {
  const finalInputProps = {
    ...inputProps,
    "data-testid": `${testIdContext}-TextInput`
  };

  const [internalValue, setInternalValue] = useState<string>(initialValue || "");
  const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");

  const requiredCheck = useCheckRequired(label);
  const emailCheck = useCheckEmail(label);
  const matchCheck = useCheckMatch(label);
  const noBelowZeroCheck = useCheckNoBelowZeroValue(label);
  const positiveNumberCheck = useCheckPositiveNumberValue(label);

  const validationHandler = useCallback(
    (value: string) => {
      if (validations) {
        for (const validation of validations) {
          let errorMsg = "";
          switch (validation.name) {
            case "required":
              errorMsg = requiredCheck(value);
              break;
            case "email":
              errorMsg = emailCheck(value);
              break;
            case "match":
              errorMsg = matchCheck(
                value,
                valueRef.current[validation.parameters.matcherField] as unknown as string,
                validation.parameters.matcherLabel
                  ? validation.parameters.matcherLabel
                  : (validation.parameters.matcherField as unknown as string)
              );
              break;
            case "no-below-zero":
              errorMsg = noBelowZeroCheck(value);
              break;
            case "positive-number":
              errorMsg = positiveNumberCheck(value);
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
    [
      emailCheck,
      matchCheck,
      noBelowZeroCheck,
      positiveNumberCheck,
      requiredCheck,
      validations,
      valueRef
    ]
  );

  useEffect(() => {
    setInternalValue(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    setInternalValue((valueRef.current[field] as unknown as string) || "");
  }, [field, valueRef]);

  useEffect(() => {
    if (errorRef.current[field] !== undefined && errorRef.current[field] !== internalErrorMsg) {
      setInternalErrorMsg(errorRef.current[field]);
    }
  }, [errorRef, field, internalErrorMsg]);

  return (
    <>
      <TextField
        margin="normal"
        fullWidth
        value={internalValue}
        label={label}
        onChange={(e) => {
          setInternalValue(e.target.value);
          errorRef.current[field] = validationHandler(e.target.value);
          if (onChange) onChange(e);
          valueRef.current[field] =
            props.type === "number"
              ? (parseInt(e.target.value) as unknown as T[keyof T])
              : (e.target.value as unknown as T[keyof T]);
        }}
        error={internalErrorMsg !== ""}
        inputProps={finalInputProps}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : undefined
        }}
        {...props}
      />
      {internalErrorMsg !== "" && (
        <FormFeedback message={internalErrorMsg} error testIdContext={testIdContext} />
      )}
    </>
  );
};

export default TextInput;
