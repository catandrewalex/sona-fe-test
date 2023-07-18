import React from "react";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

type TableContainerProps = {
  component?: typeof React.Component;
  height?: number | string;
  width?: number | string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  testIdContext?: string;
};

const TableContainer = ({
  width,
  height,
  sx,
  component: ContainerComponent,
  children,
  testIdContext
}: TableContainerProps): JSX.Element => {
  const containerStyle = {
    width: width ? width : "100%",
    height: height ? height : "100%"
  };

  if (ContainerComponent) {
    return <ContainerComponent>{children}</ContainerComponent>;
  }

  return (
    <Box
      mt={1}
      style={containerStyle}
      className="flex flex-full-percent flex-column align-center"
      data-testid={"TableContainer-" + testIdContext}
      sx={sx}
    >
      {children}
    </Box>
  );
};

export default TableContainer;
