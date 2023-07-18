/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import Tooltip from "@sonamusica-fe/components/Tooltip";

type useTableActionsParam = {
  editHandler?: (params: GridRowParams<any>) => void;
  editDisableMessage?: string;
  deleteHandler?: (params: GridRowParams<any>) => void;
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
    getActions: (params) => [
      <Tooltip content={editDisableMessage || ""} key={"edit-" + params.id}>
        <GridActionsCellItem
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

export default useTableActions;