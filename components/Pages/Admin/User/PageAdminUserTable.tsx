import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { User, UserType } from "@sonamusica-fe/types";
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
            deleteDisableMessage: "This feature is not available yet."
          }),
          {
            field: "username",
            headerName: "Username",
            flex: 1
          },
          {
            field: "name",
            headerName: "Full Name",
            valueGetter: (params) =>
              params.row.userDetail.firstName + " " + (params.row.userDetail.lastName || ""),
            flex: 2
          },
          {
            field: "email",
            headerName: "Email",
            flex: 2
          },
          {
            field: "privilegeType",
            headerName: "Type",
            valueGetter: (params) =>
              Object.entries(UserType).filter(
                (type) => type[1] === params.row.privilegeType
              )[0][0] as string,
            flex: 1
          },
          {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
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
            filterHandler: (data, value) =>
              data.userDetail.firstName.toLowerCase().includes(value.toLowerCase()) ||
              data.userDetail.lastName?.toLowerCase()?.includes(value.toLowerCase()) ||
              `${data.userDetail.firstName} ${data.userDetail.lastName || ""}`
                .toLowerCase()
                .includes(value.toLowerCase())
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
