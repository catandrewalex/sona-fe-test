import {
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridRowModesModel,
  GridRowModes
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { Add, FilterList, Search } from "@mui/icons-material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import TableMenu from "@sonamusica-fe/components/Table/TableMenu";

export interface AddItemToolbarButtonConfig<T> {
  name: string;
  defaultValue: T;
  fieldToFocus?: string;
}

type ToolbarProps<T> = {
  addItemToolbar?: boolean;
  addItemToolbarHandler?: () => void;
  name: string;
  filters?: JSX.Element[];
};

const Toolbar = <T extends { id: number }>({
  addItemToolbar,
  addItemToolbarHandler,
  name,
  filters
}: ToolbarProps<T>): JSX.Element => {
  const [showFilters, setShowFilters] = useState<boolean>(true);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ m: 1 }}>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            sx={{ py: 1, width: "120px" }}
            startIcon={<FilterList />}
            variant={showFilters ? "contained" : "outlined"}
          >
            Filters
          </Button>
        </Box>
        <Box sx={{ m: 1 }}>
          <GridToolbarColumnsButton variant="outlined" sx={{ py: 1, width: "120px" }} />
        </Box>
        <Box sx={{ m: 1 }}>
          <GridToolbarDensitySelector variant="outlined" sx={{ py: 1, width: "120px" }} />
        </Box>
        <Box sx={{ m: 1 }}>
          <GridToolbarExport variant="outlined" sx={{ py: 1, width: "120px" }} />
        </Box>
        {addItemToolbar && addItemToolbarHandler && (
          <Box sx={{ m: 1, flex: 1, textAlign: "right" }}>
            <Button variant="contained" startIcon={<Add />} onClick={addItemToolbarHandler}>
              Add {name || ""}
            </Button>
          </Box>
        )}
      </Box>
      {showFilters && <TableMenu>{filters}</TableMenu>}
    </>
  );
};

export default Toolbar;
