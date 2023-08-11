import { Typography } from "@mui/material";
import React from "react";

const BoldText = ({ children }: { children: JSX.Element | string }): JSX.Element => {
  return (
    <Typography variant="body2" fontWeight="bold" component="span">
      {children}
    </Typography>
  );
};

export default BoldText;
