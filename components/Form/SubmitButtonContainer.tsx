import Grid from "@mui/material/Grid";
import React from "react";

/**
 * Submit Button Container prop types.
 * @typedef {Object} SubmitButtonContainer
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {(JSX.Element|JSX.Element[])} children the children of this component
 * @property {string|undefined} align to adjust position of the buttons inside this component.
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 */
type SubmitButtonContainerProps = {
  align?: "left" | "center" | "right" | "space-around" | "space-between";
  children: React.ReactNode;
  testIdContext?: string;
  spacing?: number;
  marginBottom?: number;
};

/**
 * Container for grouping form submit button.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props SubmitButtonContainer
 */
const SubmitButtonContainer = ({
  align,
  children,
  testIdContext,
  spacing = 3,
  marginBottom
}: SubmitButtonContainerProps): JSX.Element => {
  let pos;

  switch (align) {
    case "left":
      pos = "flex-start";
      break;
    case "right":
      pos = "flex-end";
      break;
    case "center":
      pos = "center";
      break;
    case "space-around":
      pos = "space-around";
      break;
    case "space-between":
      pos = "space-between";
      break;
    default:
      pos = "flex-end";
  }

  return (
    <Grid
      container
      justifyContent={pos}
      spacing={spacing}
      sx={{ mt: 0, mb: marginBottom || 0 }}
      data-testid={`${testIdContext}-SubmitButtonContainer`}
    >
      {children}
    </Grid>
  );
};

export default SubmitButtonContainer;
