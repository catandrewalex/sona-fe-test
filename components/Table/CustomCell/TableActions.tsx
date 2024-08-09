/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import Tooltip from "@sonamusica-fe/components/Tooltip";

type createTableActionsParam = {
  editHandler?: (params: GridRowParams<any>) => void;
  editDisableMessage?: string;
  deleteHandler?: (params: GridRowParams<any>) => void;
  deleteDisableMessage?: string;
};

const createTableActions = ({
  editHandler,
  editDisableMessage,
  deleteHandler,
  deleteDisableMessage
}: createTableActionsParam = {}): GridColDef => {
  return {
    field: "actions",
    type: "actions",
    headerName: "",
    width: 75,
    cellClassName: "actions",
    getActions: (params) => [
      <Tooltip content={editDisableMessage || ""} key={"edit-" + params.id}>
        <GridActionsCellItem
          data-testid={"EditIcon-" + params.id}
          dense
          disableGutters
          icon={<Edit />}
          label="Edit"
          onClick={editHandler ? () => editHandler(params) : undefined}
          color="secondary"
          disabled={editHandler === undefined}
        />
      </Tooltip>,
      <Tooltip content={deleteDisableMessage || ""} key={"delete-" + params.id}>
        <GridActionsCellItem
          dense
          data-testid={"DeleteIcon-" + params.id}
          disableGutters
          icon={<Delete />}
          label="Delete"
          onClick={deleteHandler ? () => deleteHandler(params) : undefined}
          color="error"
          disabled={deleteHandler === undefined}
        />
      </Tooltip>
    ]
  };
};

export default createTableActions;
