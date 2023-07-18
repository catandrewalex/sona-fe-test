import {
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridColumnIcon,
  GridFilterListIcon
} from "@mui/x-data-grid";
import { Box, Button, Divider, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import TableMenu from "@sonamusica-fe/components/Table/TableMenu";
import Switch from "@sonamusica-fe/components/Form/Switch";

export interface AddItemToolbarButtonConfig<T> {
  name: string;
  defaultValue: T;
  fieldToFocus?: string;
}

type ToolbarProps = {
  addItemToolbar?: boolean;
  addItemToolbarHandler?: () => void;
  name: string;
  filters?: JSX.Element[];
  columns?: Array<{ name: string; text: string; value: boolean }>;
  onVisibilityColumnsChange?: (column: string, value: boolean) => void;
  onVisibilityAllColumnsChange?: (show: boolean) => void;
  testIdContext?: string;
};

const Toolbar = ({
  addItemToolbar,
  addItemToolbarHandler,
  name,
  filters,
  onVisibilityColumnsChange,
  onVisibilityAllColumnsChange,
  columns,
  testIdContext
}: ToolbarProps): JSX.Element => {
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showVisibilityColumn, setShowVisibilityColumn] = useState<boolean>(false);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ m: 1 }}>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            sx={{ py: 1, width: "120px" }}
            startIcon={<GridFilterListIcon />}
            variant={showFilters ? "contained" : "outlined"}
            data-testid={testIdContext + "-TableFilterButton"}
          >
            Filters
          </Button>
        </Box>
        <Box sx={{ m: 1 }}>
          <Button
            onClick={() => setShowVisibilityColumn(!showVisibilityColumn)}
            sx={{ py: 1, width: "120px" }}
            startIcon={<GridColumnIcon />}
            variant={showVisibilityColumn ? "contained" : "outlined"}
            data-testid={testIdContext + "-TableColumnToggleButton"}
          >
            Columns
          </Button>
        </Box>
        <Box sx={{ m: 1 }}>
          <GridToolbarDensitySelector
            data-testid={testIdContext + "-TableDensityButton"}
            variant="outlined"
            sx={{ py: 1, width: "120px" }}
          />
        </Box>
        <Box sx={{ m: 1 }}>
          <GridToolbarExport
            data-testid={testIdContext + "-TableExportButton"}
            variant="outlined"
            sx={{ py: 1, width: "120px" }}
          />
        </Box>
        {addItemToolbar && addItemToolbarHandler && (
          <Box sx={{ m: 1, flex: 1, textAlign: "right" }}>
            <Button
              data-testid={testIdContext + "-TableAddButton"}
              variant="contained"
              startIcon={<Add />}
              onClick={addItemToolbarHandler}
            >
              Add {name || ""}
            </Button>
          </Box>
        )}
      </Box>
      {showVisibilityColumn && (
        <>
          <TableMenu>
            {columns?.map((column) => (
              <Grid
                item
                key={"column-visibility-" + column.name}
                xl={2}
                md={3}
                sm={4}
                xs={6}
                sx={{ pt: "0 !important", px: 1, py: 0.5 }}
                alignSelf="flex-start"
              >
                <Switch
                  label={column.text}
                  checked={column.value}
                  onChange={(_e, checked) =>
                    onVisibilityColumnsChange
                      ? onVisibilityColumnsChange(column.name, checked)
                      : undefined
                  }
                />
              </Grid>
            ))}

            <Grid
              sm={12}
              md={12}
              lg={12}
              sx={{ pt: "0 !important", px: 1, py: 0.5 }}
              alignSelf="flex-start"
              container
            >
              <Button
                sx={{ mr: 2, width: "120px" }}
                onClick={() =>
                  onVisibilityAllColumnsChange ? onVisibilityAllColumnsChange(false) : undefined
                }
                variant="outlined"
                color="secondary"
              >
                Hide All
              </Button>
              <Button
                onClick={() =>
                  onVisibilityAllColumnsChange ? onVisibilityAllColumnsChange(true) : undefined
                }
                sx={{ mr: 2, width: "120px" }}
                variant="outlined"
                color="secondary"
              >
                Show All
              </Button>
            </Grid>
          </TableMenu>
          <Divider />
        </>
      )}
      {showFilters && (
        <>
          <TableMenu sx={{ mt: 0 }}>{filters}</TableMenu>
          <Divider />
        </>
      )}
    </>
  );
};

export default Toolbar;
