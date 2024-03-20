import {
  Box,
  BoxProps,
  Pagination as MuiPagination,
  PaginationProps as MuiPaginationProps
} from "@mui/material";
import React from "react";

type PaginationProps = MuiPaginationProps & {
  containerProps?: BoxProps;
};

const Pagination = ({ containerProps, ...props }: PaginationProps): JSX.Element => {
  return (
    <Box width="100%" display="flex" justifyContent="center" {...containerProps}>
      <MuiPagination color="primary" showFirstButton showLastButton boundaryCount={3} {...props} />
    </Box>
  );
};

export default Pagination;
