import { Box, CircularProgress, SxProps } from "@mui/material";
import React from "react";

const LoaderSimple = ({ sx }: { sx?: SxProps }): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...sx
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoaderSimple;
