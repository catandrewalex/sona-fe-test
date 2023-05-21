import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { ResponseMany } from "api";
import { User, UserType } from "@sonamusica-fe/types";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import Table from "@sonamusica-fe/components/Table";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiRef
} from "@mui/x-data-grid";
import ErrorDataGridEmpty from "@sonamusica-fe/components/Error/ErrorDataGridEmpty";
import Select from "@sonamusica-fe/components/Form/Select";
import Toolbar from "@sonamusica-fe/components/Table/Toolbar";
import TableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import Modal from "@sonamusica-fe/components/Modal";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import moment from "moment";
import AddUserModal from "@sonamusica-fe/components/AddUserModal";

const UserPage = (): JSX.Element => {
  const [data, setData] = useState<Array<User>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<User>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();
  const apiRef = useGridApiRef();

  useEffect(() => {
    API.GetAllUser().then((response) => {
      const users = apiTransformer(response, false) as ResponseMany<User>;
      if (users) setData(users.results);
      finishLoading();
      setLoading(false);
    });
  }, [user]);

  const submitHandler = (newData: User, newId: number) => {
    setData([...data, { ...newData, id: newId }]);
  };

  /*
  Add new row to datagrid:apiRef.current.updateRows([createRandomRow()]);
  */

  return (
    <PageContainer navTitle="User">
      <TableContainer>
        <Table
          name="User"
          loading={loading}
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={() => setOpen(true)}
          rows={data}
          columns={[
            TableActions({
              editHandler: (id) => {
                setSelectedData(data[(id as number) - 1]);
                setOpen(true);
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
                params.row.userDetail.firstName + " " + params.row.userDetail.lastName,
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
              valueGetter: (params) => {
                const result = Object.entries(UserType).filter(
                  (type) => type[0] === params.row.privilegeType.toString()
                )[0][1] as string;

                return result.charAt(0) + result.substring(1).toLowerCase();
              },
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
                data.userDetail.lastName.toLowerCase().includes(value.toLowerCase())
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
      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add User"
        onSuccess={submitHandler}
        submitApi={API.GetAllUser}
        data={selectedData}
      />
    </PageContainer>
  );
};

export default UserPage;
