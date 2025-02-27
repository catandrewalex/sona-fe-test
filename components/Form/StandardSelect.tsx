import { TextFieldProps } from "@mui/material/TextField";
import { AutocompleteProps } from "@mui/material/Autocomplete";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { CircularProgress, TextField, Autocomplete } from "@mui/material";

/**
 * StandardSelect component prop types.
 * @typedef {Object} StandardSelectProps
 * @extends AutoCompleteProps
 * @since 1.0.0
 * @version 1.0.0
 * @property {string|undefined} errorMsg the validation error message
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 * @property {TextFieldProps} inputProps the props that will be passed to input component
 */
interface StandardSelectProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> {
  testIdContext?: string;
  errorMsg?: string;
  inputProps?: TextFieldProps;
}

/**
 * StandardSelect component that can be searched and can select multiple selection too.
 * @since 1.0.0
 * @version 1.0.0
 * @props StandardSelectProps
 */
const StandardSelect = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>({
  inputProps,
  errorMsg,
  testIdContext,
  ...props
}: StandardSelectProps<T, Multiple, DisableClearable, FreeSolo>): JSX.Element => {
  const { getOptionLabel } = props;
  return (
    <>
      <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
        {...props}
        className="MuiAutocomplete-hasClearIcon"
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            margin="normal"
            fullWidth
            data-testid={`${testIdContext}-StandardSelect`}
            error={errorMsg !== "" && errorMsg !== undefined}
            InputProps={{
              ...params.InputProps,
              ...inputProps?.InputProps,
              endAdornment: (
                <>
                  {props.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              fullWidth: true
            }}
            {...inputProps}
          />
        )}
        renderOption={(props, option, { inputValue }) => {
          const label = getOptionLabel ? getOptionLabel(option) : "";
          const matches = match(label, inputValue);
          const parts = parse(label, matches);

          return (
            <li {...props}>
              <div>
                {parts.map((part, index) => (
                  <span
                    data-testid={`${testIdContext}-StandardSelectOption`}
                    key={label + index}
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
      {errorMsg !== undefined && errorMsg !== "" && (
        <FormFeedback message={errorMsg} error testIdContext={testIdContext} />
      )}
    </>
  );
};

export default StandardSelect;
