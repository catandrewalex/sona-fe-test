import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Student, UserType } from "@sonamusica-fe/types";
import { getFullNameFromStudent, searchFullNameByValue } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import moment from "moment";
import React from "react";

type PageAdminStudentTableProps = {
  data: Student[];
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: Student[]) => void;
};

const PageAdminStudentTable = ({
  data,
  setData,
  openModal,
  loading,
  setLoading
}: PageAdminStudentTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer>
      <Table
        name="Student"
        loading={loading}
        getRowId={(row) => row.studentId}
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        rows={data}
        columns={[
          useTableActions({
            editDisableMessage: "Please go to user list page to edit user data.",
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Student",
                  content: `Are you sure to delete ${getFullNameFromStudent(row)}?`
                },
                () => {
                  setLoading(true);
                  ADMIN_API.DeleteStudent([{ studentId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.studentId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "studentId",
            headerName: "ID",
            width: 70,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "username",
            headerName: "Username",
            valueGetter: (params) => params.row.user.username,
            flex: 2
          },
          {
            field: "name",
            headerName: "Full Name",
            valueGetter: (params) => getFullNameFromStudent(params.row),
            flex: 2
          },
          {
            field: "email",
            headerName: "Email",
            valueGetter: (params) => params.row.user.email,
            flex: 3
          },
          {
            field: "privilegeType",
            headerName: "Type",
            valueGetter: (params) =>
              Object.entries(UserType).filter(
                (type) => type[1] === params.row.user.privilegeType
              )[0][0] as string,
            align: "center",
            headerAlign: "center",
            width: 90
          },
          // TODO: fix sorting based on date, instead of text
          {
            field: "createdAt",
            headerName: "Created At",
            align: "center",
            headerAlign: "center",
            width: 125,
            valueGetter: (params) => moment(params.row.user.createdAt).format("DD MMMM YYYY")
          }
        ]}
        tableMenu={[
          {
            type: "text-input",
            field: "username",
            md: 6,
            lg: 6,
            filterHandler: (data, value) =>
              data.user.username.toLowerCase().includes(value.toLowerCase())
          },
          {
            type: "text-input",
            field: "name",
            md: 6,
            lg: 6,
            filterHandler: (data, value) => searchFullNameByValue(value, data.user)
          },
          {
            type: "text-input",
            field: "email",
            md: 6,
            lg: 6,
            filterHandler: (data, value) =>
              data.user.email.toLowerCase().includes(value.toLowerCase())
          },
          {
            type: "select",
            data: [UserType.ADMIN, UserType.STAFF, UserType.MEMBER],
            field: "privilegeType",
            getOptionLabel: (option) => UserType[option],
            md: 6,
            lg: 6,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.user.privilegeType === val;
                if (result) return true;
              }
              return false;
            }
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminStudentTable;
