import { Box, Divider, Typography } from "@mui/material";
import React from "react";

export interface TeacherPaymentClassContainerProps {
  children: React.ReactNode;
  courseName: string;
  divider?: boolean;
}

const TeacherPaymentClassContainer = ({
  children,
  courseName,
  divider
}: TeacherPaymentClassContainerProps): JSX.Element => {
  return (
    <Box
      sx={{
        my: 1.5,
        "&:first-child": {
          mt: 1
        }
      }}
    >
      <Typography variant="h5">{courseName}</Typography>
      {children}
      {divider && <Divider />}
    </Box>
  );
};

export default TeacherPaymentClassContainer;
