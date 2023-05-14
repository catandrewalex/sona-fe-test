import Box from "@mui/material/Box";
import React from "react";

/**
 * Form Feedback prop types.
 * @typedef {Object} FormFeedbackProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {boolean|undefined} error indicate whether to show error feedback or success feedback
 * @property {string|undefined} message the message that will be displayed to user
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 */
type FormFeedbackProps = {
  error?: boolean;
  message?: string;
  testIdContext?: string;
};

/**
 * For showing the user input validation message whether it's rejected or
 * accepted.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props FormFeedbackProps
 */
const FormFeedback = ({ error, message, testIdContext }: FormFeedbackProps): JSX.Element => {
  if (message && message !== "") {
    if (error) {
      return (
        <Box
          sx={{
            "&:before": {
              content: '"❌ "',
              mr: 1
            },
            color: "error.main",
            fontWeight: "bold",
            ml: 1
          }}
          data-testid={`${testIdContext}-FormFeedback`}
        >
          {message}
        </Box>
      );
    }
    return (
      <Box
        sx={{
          "&:before": {
            content: '"✓ "',
            color: "success.main",
            mr: 1
          },
          color: "success.main",
          fontWeight: "bold",
          ml: 1
        }}
        data-testid={`${testIdContext}-FormFeedback`}
      >
        {message}
      </Box>
    );
  }
  return <></>;
};

export default FormFeedback;
