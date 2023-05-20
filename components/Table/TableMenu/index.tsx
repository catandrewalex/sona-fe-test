import Grid from "@mui/material/Grid";
import React from "react";

type TableMenuContainerProps = {
  children: React.ReactNode;
};

const TableMenu = ({ children }: TableMenuContainerProps): JSX.Element => {
  return (
    <Grid data-testid="sampah" sx={{ my: 1, px: 1 }} container alignItems="flex-end" spacing={0}>
      {children}
    </Grid>
  );
};
export default TableMenu;
