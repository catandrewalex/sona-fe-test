import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import useModalRenderer from "@sonamusica-fe/components/Modal/ModalRenderer";
import UserDetailModalContent from "@sonamusica-fe/components/Pages/Admin/User/UserDetail/UserDetailRenderer";
import { MemoizedTable, TableMenuConfig } from "@sonamusica-fe/components/Table";
import createTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import { MemoizedTableContainer } from "@sonamusica-fe/components/Table/TableContainer";
import { User, UserType } from "@sonamusica-fe/types";
import { getFullNameFromUser, searchFullNameByValue } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";

type PageAdminUserTableProps = {
  data: User[];
  setSelectedData: (newSelectedData?: User) => void;
  openModal: () => void;
  loading: boolean;
};

const PageAdminUserTable = ({
  data,
  setSelectedData,
  openModal,
  loading
}: PageAdminUserTableProps): JSX.Element => {
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
      <MemoizedTableContainer testIdContext="AdminUser">
        <MemoizedTable
          name="User"
          testIdContext="AdminUser"
          loading={loading}
          getRowId={useCallback((row) => row.userId, [])}
          getRowClassNameAddition={useCallback(
            (params) => (params.row.isDeactivated ? "deactivated-row" : "default"),
            []
          )}
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={openModal}
          rows={data}
          columns={useMemo((): GridColDef[] => {
            return [
              createTableActions({
                editHandler: ({ id }) => {
                  setSelectedData(data.filter((val) => val.userId === id)[0]);
                  openModal();
                },
                deleteDisableMessage:
                  "User deletion is disabled. You can deactivate this user instead."
              }),
              {
                field: "userId",
                headerName: "ID",
                width: 70,
                align: "center",
                headerAlign: "center"
              },
              {
                field: "username",
                headerName: "Username",
                flex: 2
              },
              {
                field: "name",
                headerName: "Full Name",
                valueGetter: (params) => getFullNameFromUser(params.row),
                flex: 2
              },
              {
                field: "email",
                headerName: "Email",
                flex: 3
              },
              {
                field: "privilegeType",
                headerName: "Type",
                valueGetter: (params) =>
                  Object.entries(UserType).filter(
                    (type) => type[1] === params.row.privilegeType
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
                valueGetter: (params) => moment(params.row.createdAt),
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
                      setSelectedUser(params.row);
                      openModalUserDetail();
                    }}
                  >
                    View
                  </Button>
                )
              }
            ];
          }, [data, setSelectedData, openModal, setSelectedUser, openModalUserDetail])}
          tableMenu={useMemo((): TableMenuConfig[] => {
            return [
              {
                type: "text-input",
                field: "username",
                xs: 6,
                md: 4,
                lg: 2.5,
                filterHandler: (data, value) =>
                  data.username.toLowerCase().includes(value.toLowerCase())
              },
              {
                type: "text-input",
                field: "name",
                xs: 6,
                md: 4,
                lg: 2.5,
                filterHandler: (data, value) => searchFullNameByValue(value, data as User)
              },
              {
                type: "text-input",
                field: "email",
                xs: 6,
                md: 4,
                lg: 2.5,
                filterHandler: (data, value) =>
                  data.email.toLowerCase().includes(value.toLowerCase())
              },
              {
                type: "select",
                data: [UserType.ADMIN, UserType.STAFF, UserType.MEMBER],
                field: "privilegeType",
                getOptionLabel: (option) => UserType[option],
                xs: 6,
                md: 4,
                lg: 2.5,
                filterHandler: (data, value) => {
                  for (const val of value) {
                    const result = data.privilegeType === val;
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
                    const result = data.isDeactivated === val;
                    if (result) return true;
                  }
                  return false;
                }
              }
            ];
          }, [])}
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

export default PageAdminUserTable;
