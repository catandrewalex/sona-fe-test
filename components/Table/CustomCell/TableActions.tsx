import { Button } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import Tooltip from "@sonamusica-fe/components/Tooltip";

type useTableActionsParam = {
  editHandler?: (id: GridRowId) => void;
  editDisableMessage?: string;
  deleteHandler?: (id: GridRowId) => void;
  deleteDisableMessage?: string;
};

const useTableActions = ({
  editHandler,
  editDisableMessage,
  deleteHandler,
  deleteDisableMessage
}: useTableActionsParam = {}): GridColDef => {
  return {
    field: "actions",
    type: "actions",
    headerName: "",
    width: 75,
    cellClassName: "actions",
    getActions: ({ id }) => [
      <Tooltip data-testid="haha" content={editDisableMessage || ""} key={"edit-" + id}>
        <GridActionsCellItem
          dense
          disableGutters
          icon={<Edit />}
          label="Edit"
          onClick={editHandler ? () => editHandler(id) : undefined}
          color="secondary"
          disabled={editHandler === undefined}
        />
      </Tooltip>,
      <Tooltip content={deleteDisableMessage || ""} key={"delete-" + id}>
        <GridActionsCellItem
          dense
          disableGutters
          icon={<Delete />}
          label="Delete"
          onClick={deleteHandler ? () => deleteHandler(id) : undefined}
          color="error"
          disabled={deleteHandler === undefined}
        />
      </Tooltip>
    ]
  };
};

export default useTableActions;
