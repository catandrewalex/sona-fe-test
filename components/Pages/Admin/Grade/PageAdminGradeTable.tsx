import Table from "@sonamusica-fe/components/Table";
import createTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Grade } from "@sonamusica-fe/types";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";

type PageAdminGradeTableProps = {
  data: Grade[];
  setSelectedData: (newSelectedData?: Grade) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: Grade[]) => void;
};

const PageAdminGradeTable = ({
  data,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData
}: PageAdminGradeTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer testIdContext="AdminGrade">
      <Table
        name="Grade"
        testIdContext="AdminGrade"
        loading={loading}
        getRowId={(row) => row.gradeId}
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        rows={data}
        columns={[
          createTableActions({
            editHandler: ({ id }) => {
              setSelectedData(data.filter((val) => val.gradeId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Grade",
                  content: `Are you sure to delete ${row.name}?`
                },
                () => {
                  setLoading(true);
                  ADMIN_API.DeleteGrade([{ gradeId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.gradeId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "gradeId",
            headerName: "ID",
            width: 100,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "name",
            headerName: "Grade Name",
            flex: 1
          }
        ]}
        tableMenu={[
          {
            type: "text-input",
            field: "name",
            xs: 12
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminGradeTable;
