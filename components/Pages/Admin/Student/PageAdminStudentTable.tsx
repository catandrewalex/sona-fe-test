import { Button } from "@mui/material";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import useModalRenderer from "@sonamusica-fe/components/Modal/ModalRenderer";
import UserDetailModalContent from "@sonamusica-fe/components/Pages/Admin/User/UserDetail/UserDetailRenderer";
import { MemoizedTable } from "@sonamusica-fe/components/Table";
import createTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import { MemoizedTableContainer } from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Student, User, UserType } from "@sonamusica-fe/types";
import { getFullNameFromStudent, searchFullNameByValue } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import moment from "moment";
import React, { useState } from "react";

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

  const [selectedUser, setSelectedUser] = useState<User>();
  const { openModal: openModalUserDetail, ModalRenderer } = useModalRenderer({
    onClose: () => setSelectedUser(undefined),
    closeIcon: true,
    minWidth: "30vw",
    maxWidth: "75vw"
  });

  return (
    <>
      {/* We need memoized TableContainer & Table due to need of displaying "userDetail" using modal.
      The memoized versions are useful for preventing whole-table rerender when we're opening/closing the "userDetail" modal. */}
      <MemoizedTableContainer>
        <MemoizedTable
          name="Student"
          loading={loading}
          getRowId={(row) => row.studentId}
          getRowClassNameAddition={(params) =>
            params.row.user.isDeactivated ? "deactivated-row" : "default"
          }
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={openModal}
          rows={data}
          columns={[
            createTableActions({
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
            {
              field: "createdAt",
              headerName: "Created At",
              align: "center",
              headerAlign: "center",
              width: 125,
              valueGetter: (params) => moment(params.row.user.createdAt),
              valueFormatter: (params) => params.value.format("DD MMMM YYYY")
            },
            {
              field: "userDetail",
              headerName: "Detail",
              align: "center",
              headerAlign: "center",
              sortable: false,
              width: 80,
              renderCell: (params) => (
                <Button
                  color="primary"
                  onClick={() => {
                    setSelectedUser(params.row.user);
                    openModalUserDetail();
                  }}
                >
                  View
                </Button>
              )
            }
          ]}
          tableMenu={[
            {
              type: "text-input",
              field: "username",
              xs: 6,
              md: 4,
              lg: 2.5,
              filterHandler: (data, value) =>
                data.user.username.toLowerCase().includes(value.toLowerCase())
            },
            {
              type: "text-input",
              field: "name",
              xs: 6,
              md: 4,
              lg: 2.5,
              filterHandler: (data, value) => searchFullNameByValue(value, data.user)
            },
            {
              type: "text-input",
              field: "email",
              xs: 6,
              md: 4,
              lg: 2.5,
              filterHandler: (data, value) =>
                data.user.email.toLowerCase().includes(value.toLowerCase())
            },
            {
              type: "select",
              data: [UserType.ADMIN, UserType.STAFF, UserType.MEMBER],
              field: "privilegeType",
              xs: 6,
              md: 4,
              lg: 2.5,
              getOptionLabel: (option) => UserType[option],
              filterHandler: (data, value) => {
                for (const val of value) {
                  const result = data.user.privilegeType === val;
                  if (result) return true;
                }
                return false;
              }
            },
            {
              type: "select",
              data: [true, false],
              field: "isDeactivated",
              xs: 6,
              md: 4,
              lg: 2,
              getOptionLabel: (option) => (option ? "Yes" : "No"),
              filterHandler: (data, value) => {
                for (const val of value) {
                  const result = data.user.isDeactivated === val;
                  if (result) return true;
                }
                return false;
              }
            }
          ]}
        />
      </MemoizedTableContainer>

      {selectedUser && (
        <ModalRenderer>
          <UserDetailModalContent selectedUser={selectedUser} />
        </ModalRenderer>
      )}
    </>
  );
};

export default PageAdminStudentTable;
