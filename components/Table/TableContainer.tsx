import React from "react";
import { SxProps } from "@mui/system";

import { Box, Theme } from "@mui/material";

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

export const MemoizedTableContainer = React.memo(TableContainer);

export default TableContainer;
