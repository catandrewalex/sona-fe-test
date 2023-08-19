import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableProps,
  TableRow,
  TableRowProps,
  Typography
} from "@mui/material";
import { CSSProperties } from "@mui/styles";
import { styled } from "@mui/system";
import { merge } from "lodash";
import React from "react";

export interface FormDataViewerTableConfig {
  title: string | JSX.Element;
  value: string | JSX.Element;
  sx?: CSSProperties;
}

type FormDataViewerTableProps = {
  dataTitle?: string;
  data: FormDataViewerTableConfig[];
  tableProps?: TableProps;
  tableRowProps?: TableRowProps;
  tableCellProps?: Omit<TableCellProps, "sx"> & { sx: CSSProperties };
};

const CellTitle = styled(TableCell)({
  width: "30%"
});

const CellSemiColon = styled(TableCell)({
  align: "center",
  width: "10px"
});

const FormDataViewerTable = ({
  data,
  dataTitle,
  tableProps,
  tableRowProps,
  tableCellProps
}: FormDataViewerTableProps): JSX.Element => {
  return (
    <Box>
      {dataTitle && (
        <>
          <Typography variant="h5" sx={{ mx: 1 }}>
            {dataTitle}
          </Typography>
          <Divider sx={{ m: 1 }} />
        </>
      )}
      <Table
        {...tableProps}
        sx={merge(
          {
            "& .MuiTableCell-root": { borderBottom: "none" },

            "& .MuiTableCell-root:first-child": {
              pr: 0
            },
            "& .MuiTableCell-root:last-child": {
              pl: 0
            },
            "& .MuiTableCell-root:not(:last-child):not(:first-child)": {
              px: 1
            }
          },
          tableProps?.sx
        )}
      >
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.title + "-" + item.value} {...tableRowProps}>
                <CellTitle {...tableCellProps} sx={merge({}, tableCellProps?.sx, item?.sx)}>
                  {item.title}
                </CellTitle>
                <CellSemiColon {...tableCellProps} sx={merge({}, tableCellProps?.sx, item?.sx)}>
                  :
                </CellSemiColon>
                <TableCell {...tableCellProps} sx={merge({}, tableCellProps?.sx, item?.sx)}>
                  {item.value}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FormDataViewerTable;
