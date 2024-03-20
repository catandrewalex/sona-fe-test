import { GridProps } from "@mui/material/Grid";
import React from "react";

import { Grid } from "@mui/material";

/**
 * Chart Container prop types.
 * @typedef {Object} ChartContainerProps
 * @extends GridProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {React.ReactNode} children the children of this component
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 */
export interface FormFieldTypes extends GridProps {
  children?: React.ReactNode;
  testIdContext?: string;
}

/**
 * Container for form input.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props FormFieldProps
 */
const FormField = ({ children, testIdContext, ...props }: FormFieldTypes): JSX.Element => {
  const { lg, md } = props;

  return (
    <Grid
      {...props}
      item
      lg={lg || 6}
      md={md || 12}
      sm={12}
      data-testid={`${testIdContext}-FormField`}
    >
      {children}
    </Grid>
  );
};

export default FormField;
