/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DataGrid,
  GridColDef,
  GridInitialState,
  GridRowParams,
  GridRowsProp,
  GridSlotsComponent,
  GridSlotsComponentsProps,
  GridCallbackDetails,
  GridRowModel,
  GridRowSelectionModel,
  GridInputRowSelectionModel,
  GridRowIdGetter,
  GridColumnVisibilityModel
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import Grid, { GridSize } from "@mui/material/Grid";
import TextInputFilter from "./TableMenu/TextInputFilter";
import { useDebouncedCallback } from "use-debounce";
import SelectFilter from "./TableMenu/SelectFilter";
import { CSSProperties } from "@mui/styles";
import ErrorDataGridEmpty from "@sonamusica-fe/components/Error/ErrorDataGridEmpty";
import { UncapitalizeObjectKeys } from "@mui/x-data-grid/internals";
import Toolbar from "@sonamusica-fe/components/Table/Toolbar";
import { titleCase } from "@sonamusica-fe/utils/StringUtil";
interface DefaultFilterConfig {
  xl?: GridSize;
  lg?: GridSize;
  md?: GridSize;
  xs?: GridSize;
  sx?: CSSProperties;
}

interface TextInputConfig extends DefaultFilterConfig {
  type: "text-input";
  field: string;
  filterHandler?: (data: GridRowModel, value: any) => boolean;
  columnLabel?: string;
  helperText?: string;
}

interface SelectConfig extends DefaultFilterConfig {
  type: "select";
  field: string;
  data: Array<any>;
  limitTags?: number;
  getOptionLabel: (option: any) => string;
  filterHandler?: (data: GridRowModel, value: any) => boolean;
}

interface CustomConfig extends DefaultFilterConfig {
  type: "custom";
  style?: React.CSSProperties;
  component: React.ReactNode;
}

type TableMenuConfig = TextInputConfig | SelectConfig | CustomConfig;

type TableProps = {
  tableMenu?: TableMenuConfig[];
  className?: string;
  columns: GridColDef[];
  rows: GridRowsProp;
  rowDisplayed?: number;
  stripped?: boolean;
  getRowClassName?: (params: GridRowParams) => string;
  initialState?: GridInitialState;
  isRowSelectable?: (params: GridRowParams) => boolean;
  loading?: boolean;
  style?: CSSProperties;
  rowsPerPageOptions?: Array<number>;
  disableFooter?: boolean;
  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  onSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => void;
  ReplaceNoRowsOverlay?: () => JSX.Element;
  rowHeightMultiplier?: number;
  getRowClassNameAddition?: (params: GridRowParams) => string;
  selectionModel?: GridInputRowSelectionModel;
  components?: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> | undefined;
  componentsProps?: GridSlotsComponentsProps;
  onPageSizeChange?: (pageSize: number, details: GridCallbackDetails) => void;
  resetPageOnRowChange?: boolean;
  keepFilterWhenDataChange?: boolean;
  getRowId?: GridRowIdGetter<any>;
  addItemToolbar?: boolean;
  addItemToolbarHandler?: () => void;
  name?: string;
  testIdContext?: string;
  columnVisibilityModelDefault?: GridColumnVisibilityModel;
};

const Table = ({
  columns,
  rows,
  rowDisplayed,
  stripped,
  isRowSelectable,
  initialState,
  className,
  tableMenu,
  loading,
  style,
  disableFooter,
  rowsPerPageOptions = [20, 50, 100],
  checkboxSelection,
  disableSelectionOnClick,
  onSelectionModelChange,
  ReplaceNoRowsOverlay,
  rowHeightMultiplier,
  getRowClassNameAddition,
  selectionModel,
  components,
  onPageSizeChange,
  componentsProps,
  resetPageOnRowChange,
  keepFilterWhenDataChange,
  getRowId,
  addItemToolbar,
  addItemToolbarHandler,
  testIdContext,
  name,
  columnVisibilityModelDefault
}: TableProps): JSX.Element => {
  const [data, setData] = useState<GridRowsProp>(rows);
  const [dataSize, setDataSize] = useState<number>(0);
  const [columnsData, setColumnsData] = useState<GridColDef[]>(columns);
  const [filterValue, setFilterValue] = useState<Record<string, any>>({});
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<
    GridColumnVisibilityModel | undefined
  >(columnVisibilityModelDefault);

  const [pageSize, setPageSize] = useState<number>(
    rowDisplayed ? rowDisplayed : rowsPerPageOptions[0]
  );
  const [page, setPage] = useState<number>(0);

  function getRowClassNameFunction(params: GridRowParams) {
    if (getRowClassNameAddition) return getRowClassNameAddition(params);
    return `default`;
  }

  function CustomNoRowsOverlay() {
    if (ReplaceNoRowsOverlay) return ReplaceNoRowsOverlay;
    return ErrorDataGridEmpty;
  }

  useEffect(() => {
    setData(rows);
    if (!keepFilterWhenDataChange) setFilterValue({});
    setPageSize(rowDisplayed || rowsPerPageOptions[0]);
    if (resetPageOnRowChange) {
      // 3 is threshold
      if (Math.abs(dataSize - rows.length) > 3) setPage(0);
      setDataSize(rows.length);
    }
  }, [rows]);

  useEffect(() => {
    if (stripped) {
      columns.map((col, index) => {
        col.filterable = false;
        col.cellClassName = index % 2 === 0 ? "even" : "odd";
      });
    } else {
      columns.map((col) => {
        col.filterable = false;
      });
    }
    setColumnsData(columns);
  }, [columns]);

  useEffect(() => {
    setData(
      rows.filter((item: GridRowModel) => {
        let result = true;
        for (const [key, value] of Object.entries(filterValue)) {
          if (
            (Array.isArray(value.value) && value.value.length > 0) ||
            (typeof value.value === "string" && value.value !== "")
          ) {
            if (value.filterHandle) {
              result = result && value.filterHandle(item, value.value);
            } else {
              result = result && item[key].toLowerCase().indexOf(value.value.toLowerCase()) !== -1;
            }
          }
        }
        return result;
      })
    );
  }, [filterValue, rows]);

  useEffect(() => {
    const newVisibilityModel: GridColumnVisibilityModel = {};
    for (const column of columns) {
      if (column.field !== "id" && column.field !== "actions") {
        if (columnVisibilityModel && columnVisibilityModel[column.field] !== undefined) {
          newVisibilityModel[column.field] = columnVisibilityModel[column.field];
        }
      }
    }
    setColumnVisibilityModel(newVisibilityModel);
  }, [columns]);

  const tableMenuTextInputHandler = useDebouncedCallback(
    (column: string, value: string, filterHandle?: (data: GridRowModel, value: any) => boolean) => {
      setFilterValue({
        ...filterValue,
        [column]: { value, filterHandle }
      });
    },
    250
  );

  const tableMenuSelectHandler = useDebouncedCallback(
    (column: string, value: any[], filterHandle?: (data: GridRowModel, value: any) => boolean) => {
      setFilterValue({
        ...filterValue,
        [column]: { value, filterHandle }
      });
    },
    100
  );

  const tableMenuItem: JSX.Element[] = [];

  if (tableMenu) {
    tableMenu.forEach((item, index) => {
      if (item.type === "text-input") {
        tableMenuItem.push(
          <TextInputFilter
            keyChild={"text-filter" + index}
            key={"text-filter" + index}
            column={item.field}
            columnLabel={item.columnLabel}
            helperText={item.helperText}
            xs={item.xs}
            md={item.md}
            lg={item.lg}
            xl={item.xl}
            sx={item.sx}
            testIdContext={testIdContext + "-" + titleCase(item.field)}
            onChange={(value) => tableMenuTextInputHandler(item.field, value, item.filterHandler)}
            value={filterValue[item.field]?.value || []}
          />
        );
      } else if (item.type === "select") {
        tableMenuItem.push(
          <SelectFilter
            keyChild={"select-filter" + index}
            key={"select-filter" + index}
            column={item.field}
            getOptionLabel={item.getOptionLabel}
            data={item.data}
            xs={item.xs}
            md={item.md}
            lg={item.lg}
            xl={item.xl}
            sx={item.sx}
            limitTags={item.limitTags}
            testIdContext={testIdContext + "-" + titleCase(item.field)}
            onChange={(value) => tableMenuSelectHandler(item.field, value, item.filterHandler)}
            value={filterValue[item.field]?.value || []}
          />
        );
      } else if (item.type === "custom") {
        tableMenuItem.push(
          <Grid
            style={item.style}
            item
            xl={item.xl}
            key={"custom-filter" + index}
            lg={item.lg}
            md={item.md}
            xs={item.xs}
            sx={{ pt: "0 !important", ...item.sx }}
            alignSelf="flex-start"
            data-testid={testIdContext + "-TableCustomFilter"}
          >
            {item.component}
          </Grid>
        );
      }
    });
  }

  const tableVisibilityItem = columns
    .map((column) => ({
      name: column.field,
      text: column.headerName,
      value:
        columnVisibilityModel && columnVisibilityModel[column.field] !== undefined
          ? columnVisibilityModel[column.field]
          : true
    }))
    .filter((column) => column.text);

  return (
    <>
      {/* <TableMenu>{tableMenuItem}</TableMenu> */}
      <DataGrid
        disableRowSelectionOnClick={disableSelectionOnClick}
        checkboxSelection={checkboxSelection}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay(),
          toolbar: Toolbar,
          ...components
        }}
        getRowId={getRowId}
        slotProps={{
          toolbar: {
            name,
            addItemToolbar,
            addItemToolbarHandler,
            filters: tableMenuItem,
            columns: tableVisibilityItem,
            onVisibilityColumnsChange: (column: string, value: boolean) => {
              setColumnVisibilityModel({ ...columnVisibilityModel, [column]: value });
            },
            onVisibilityAllColumnsChange: (show: boolean) => {
              if (columnVisibilityModel) {
                const newColumnVisibilityModel: GridColumnVisibilityModel = {};
                columns.forEach((column) => {
                  if (column.field !== "id" && column.field !== "actions") {
                    newColumnVisibilityModel[column.field] = show;
                  }
                });
                setColumnVisibilityModel(newColumnVisibilityModel);
              }
            },
            testIdContext: testIdContext
          },
          columnsPanel: {
            getTogglableColumns: (columns) =>
              columns.filter((column) => column.field !== "actions").map((column) => column.field)
          },
          ...componentsProps
        }}
        rowHeight={(rowHeightMultiplier || 1) * 52} //  52 is default value from MUI docs
        columns={columnsData}
        paginationModel={{ page, pageSize }}
        pageSizeOptions={rowsPerPageOptions}
        rows={data}
        style={{
          width: "100%",
          ...style
        }}
        getRowClassName={(params) => getRowClassNameFunction(params)}
        pagination
        onPaginationModelChange={(model, details) => {
          setPageSize(model.pageSize);
          setPage(model.page);
          if (onPageSizeChange) onPageSizeChange(model.pageSize, details);
        }}
        hideFooter={disableFooter}
        disableColumnMenu
        loading={loading}
        className={
          isRowSelectable === undefined
            ? `${className ? className : ""} grid-disable-selection`
            : className
        }
        initialState={initialState}
        isRowSelectable={isRowSelectable || (() => false)}
        onRowSelectionModelChange={onSelectionModelChange}
        rowSelectionModel={selectionModel}
        columnVisibilityModel={columnVisibilityModel}
      />
    </>
  );
};

export default Table;
