/* eslint-disable react/destructuring-assignment */
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React from "react";
import FormFeedback from "@sonamusica-fe/components/Form/FormFeedback";
import { InputAdornment } from "@mui/material";

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
type TextInputProps = {
  errorMsg?: string;
  testIdContext?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

/**
 * Input component for text.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props TextInputProps
 */
const TextInput = ({
  errorMsg,
  testIdContext,
  startAdornment,
  endAdornment,
  inputProps,
  ...props
}: TextFieldProps & TextInputProps): JSX.Element => {
  const finalInputProps = {
    ...inputProps,
    "data-testid": `${testIdContext}-TextInput`
  };

  return (
    <>
      <TextField
        margin="normal"
        fullWidth
        error={errorMsg !== undefined && errorMsg !== ""}
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
      {errorMsg !== undefined && errorMsg !== "" && (
        <FormFeedback message={errorMsg} error testIdContext={testIdContext} />
      )}
    </>
  );
};

export default TextInput;
