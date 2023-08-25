import { Theme } from "@emotion/react";
import { SxProps } from "@mui/system";
import React from "react";
import { Grid } from "@mui/material";

type TableMenuContainerProps = {
  children: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
};

const TableMenu = ({ children, sx }: TableMenuContainerProps): JSX.Element => {
  return (
    <Grid
      data-testid="sampah"
      sx={{ my: 1, px: 1, ...sx }}
      container
      alignItems="flex-end"
      spacing={0}
    >
      {children}
    </Grid>
  );
};
export default TableMenu;
