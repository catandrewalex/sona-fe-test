import Grid, { GridProps } from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import React, { FormEvent } from "react";

/**
 * Form prop types.
 * @typedef {Object} FormProps
 * @extends GridProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {React.ReactNode} children the children of this component
 * @property {React.ReactNode} formSubmit the form submit component that usually show submit button
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 * @property {boolean} submitPositionTop if true, position the form submit on top of the form, else otherwise
 * @property {function} onSubmit submit handler (listener) that can handle when user submit the from
 */
interface FormProps extends Omit<GridProps, "onSubmit"> {
  disableSubmit?: boolean;
  children?: React.ReactNode;
  formSubmit?: React.ReactNode;
  submitPositionTop?: boolean;
  testIdContext?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  loading?: boolean;
}

/**
 * Wrapper for html form.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props FormProps
 */
const Form = ({
  disableSubmit,
  children,
  formSubmit,
  submitPositionTop = false,
  testIdContext,
  onSubmit,
  loading,
  ...props
}: FormProps): JSX.Element => {
  const submit =
    !disableSubmit &&
    (formSubmit || (
      <SubmitButtonContainer testIdContext={testIdContext}>
        <SubmitButton fullWidth loading={loading} testIdContext={testIdContext} />
      </SubmitButtonContainer>
    ));

  return (
    <Box
      component="form"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
      sx={{ width: "100%" }}
      noValidate
      data-testid={`${testIdContext}-Form`}
    >
      {submitPositionTop && submit}
      <Grid spacing={3} {...props} container>
        {children}
      </Grid>
      {!submitPositionTop && submit}
    </Box>
  );
};

export default Form;
