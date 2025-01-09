/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFieldProps } from "@mui/material/TextField";
import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React, { useCallback, useEffect, useState } from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { ValidationConfig, useCheckNotNull } from "@sonamusica-fe/utils/ValidationUtil";
import { AutocompleteValue, TextField, Autocomplete, AutocompleteProps } from "@mui/material";

/**
 * Select component prop types.
 * @typedef {Object} SelectProps
 * @extends AutoCompleteProps
 * @since 1.0.0
 * @version 1.0.0
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 * @property {TextFieldProps} inputProps the props that will be passed to input component
 */
export interface SelectProps<
  T,
  K,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    "renderInput" | "onChange"
  > {
  testIdContext?: string;
  inputProps?: TextFieldProps;
  initialValue?: T | null;
  validations?: Array<ValidationConfig<K>>;
  field: keyof K;
  label: string;
  valueRef: React.MutableRefObject<K>;
  errorRef: React.MutableRefObject<Record<keyof K, string>>;
  onChange?: (
    valueRef: React.MutableRefObject<K>,
    errorRef: React.MutableRefObject<Record<keyof K, string>>,
    event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
    reason: AutocompleteChangeReason
  ) => void | undefined;
}

/**
 * Select component that can be searched and can select multiple selection too.
 * @since 1.0.0
 * @version 1.0.0
 * @props SelectProps
 */
const Select = <
  T,
  K = any,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>({
  inputProps,
  testIdContext,
  initialValue = null,
  validations,
  field,
  label,
  valueRef,
  errorRef,
  onChange,
  ...props
}: SelectProps<T, K, Multiple, DisableClearable, FreeSolo>): JSX.Element => {
  const { getOptionLabel } = props;
  const [internalValue, setInternalValue] = useState<T | null>(initialValue);
  const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");

  const requiredCheck = useCheckNotNull(label);

  const validationHandler = useCallback(
    (value: T | null) => {
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
    if (errorRef.current[field] && errorRef.current[field] !== internalErrorMsg) {
      setInternalErrorMsg(errorRef.current[field]);
    }
  }, [errorRef.current[field]]);

  useEffect(() => {
    setInternalValue(initialValue || null);
  }, [initialValue]);

  useEffect(() => {
    setInternalValue(valueRef.current[field] as any);
  }, [valueRef.current[field]]);

  return (
    <>
      <Autocomplete
        {...props}
        className="MuiAutocomplete-hasClearIcon"
        filterSelectedOptions
        value={internalValue as AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>}
        onChange={(e, value, reason) => {
          setInternalValue(value as T | null);
          errorRef.current[field] = validationHandler(value as any);
          if (onChange) onChange(valueRef, errorRef, e, value, reason);
          valueRef.current[field] = value as any;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            margin="normal"
            fullWidth
            value={internalValue}
            label={label}
            data-testid={`${testIdContext}-Select`}
            error={internalErrorMsg !== "" && internalErrorMsg !== undefined}
            {...inputProps}
          />
        )}
        renderOption={(props, option, { inputValue }) => {
          const { key, ...optionProps } = props;
          const label = getOptionLabel ? getOptionLabel(option) : "";
          const matches = match(label, inputValue, { insideWords: true });
          const parts = parse(label, matches);

          return (
            <li key={key} {...optionProps}>
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: part.highlight ? "rgb(254, 240, 13)" : ""
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          );
        }}
      />
      {internalErrorMsg !== undefined && internalErrorMsg !== "" && (
        <FormFeedback message={internalErrorMsg} error testIdContext={testIdContext} />
      )}
    </>
  );
};

export default Select;
