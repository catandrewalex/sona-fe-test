import { GridProps } from "@mui/material/Grid";
import { ButtonProps } from "@mui/material/Button";
import { merge } from "lodash";
import React from "react";
import { Grid, Button, CircularProgress } from "@mui/material";

/**
 * Submit Button prop types.
 * @typedef {Object} ChartContainerProps
 * @extends ButtonProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {string|undefined} submitText the optional submit button text. Default will be 'Submit'.
 * @property {boolean|undefined} regular if true, the button acts as regular button, and you must provide onClick listener to it.
 * @property {boolean|undefined} loading if true, the loading animation will show instead of submit text.
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 */
export interface SubmitButtonProps
  extends ButtonProps,
    Pick<GridProps, "xl" | "lg" | "md" | "xs" | "sm"> {
  submitText?: string;
  regular?: boolean;
  loading?: boolean;
  testIdContext?: string;
  align?: "center" | "left" | "right";
}

/**
 * A button that appear on form element usually used to submit the form.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props SubmitButtonProps
 */
const SubmitButton = ({
  submitText = "Submit",
  regular = false,
  loading = false,
  color = "primary",
  variant = "contained",
  fullWidth = false,
  testIdContext,
  xs = 12,
  sm = 12,
  md = 6,
  lg = 4,
  xl = 3,
  align = "center",
  ...props
}: SubmitButtonProps): JSX.Element => {
  const { sx, disabled } = props;

  return (
    <Grid xs={xs} sm={sm} md={md} lg={lg} xl={xl} item sx={{ textAlign: align }}>
      <Button
        {...props}
        type={regular ? "button" : "submit"}
        fullWidth={fullWidth}
        variant={variant}
        color={color}
        disabled={loading || disabled}
        data-testid={`${testIdContext}-${regular ? "Button" : "SubmitButton"}`}
        sx={merge({}, sx, { fontSize: "1rem", m: 0 })}
      >
        {loading ? (
          <CircularProgress
            sx={{
              color: "text.primary",
              m: ".5rem"
            }}
            size="1rem"
          />
        ) : (
          submitText
        )}
      </Button>
    </Grid>
  );
};

export default SubmitButton;
