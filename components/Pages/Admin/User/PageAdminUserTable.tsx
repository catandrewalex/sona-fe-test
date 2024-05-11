import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { User, UserType } from "@sonamusica-fe/types";
import { getFullNameFromUser, searchFullNameByValue } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";

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
  return (
    <TableContainer testIdContext="AdminUser">
      <Table
        name="User"
        testIdContext="AdminUser"
        loading={loading}
        getRowId={(row) => row.userId}
        getRowClassNameAddition={(params) =>
          params.row.isDeactivated ? "deactivated-row" : "default"
        }
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        rows={data}
        columns={[
          useTableActions({
            editHandler: ({ id }) => {
              setSelectedData(data.filter((val) => val.userId === id)[0]);
              openModal();
            },
            deleteDisableMessage: "User deletion is disabled. You can deactivate this user instead."
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
          // TODO: fix sorting based on date, instead of text
          {
            field: "createdAt",
            headerName: "Created At",
            align: "center",
            headerAlign: "center",
            width: 125,
            valueGetter: (params) => moment(params.row.createdAt).format("DD MMMM YYYY")
          }
        ]}
        tableMenu={[
          {
            type: "text-input",
            field: "username",
            md: 6,
            lg: 6,
            filterHandler: (data, value) =>
              data.username.toLowerCase().includes(value.toLowerCase())
          },
          {
            type: "text-input",
            field: "name",
            md: 6,
            lg: 6,
            filterHandler: (data, value) => searchFullNameByValue(value, data as User)
          },
          {
            type: "text-input",
            field: "email",
            md: 6,
            lg: 6,
            filterHandler: (data, value) => data.email.toLowerCase().includes(value.toLowerCase())
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
                const result = data.privilegeType === val;
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

export default PageAdminUserTable;
