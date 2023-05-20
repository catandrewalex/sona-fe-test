import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { ResponseMany } from "api";
import { Student, Teacher, User, UserType } from "@sonamusica-fe/types";
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
  const [data, setData] = useState<Array<Student>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();
  const apiRef = useGridApiRef();

  useEffect(() => {
    API.GetAllStudent().then((response) => {
      const teachers = apiTransformer(response, false) as ResponseMany<Student>;
      if (teachers) setData(teachers.results);
      finishLoading();
      setLoading(false);
    });
  }, [user]);

  const submitHandler = (data: User) => {};

  /*
  Add new row to datagrid:apiRef.current.updateRows([createRandomRow()]);
  */

  return (
    <PageContainer navTitle="Student">
      <TableContainer>
        <Table
          name="Student"
          loading={loading}
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={() => setOpen(true)}
          rows={data}
          getRowId={(row) => row.studentId}
          columns={[
            TableActions({
              editDisableMessage: "Please go to user list page to edit user data.",
              deleteDisableMessage: "Please go to user list page to delete user."
            }),
            {
              field: "username",
              headerName: "Username",
              valueGetter: (params) => params.row.user.username,
              flex: 1
            },
            {
              field: "name",
              headerName: "Full Name",
              valueGetter: (params) =>
                params.row.user.userDetail.firstName + " " + params.row.user.userDetail.lastName,
              flex: 2
            },
            {
              field: "email",
              headerName: "Email",
              valueGetter: (params) => params.row.user.email,
              flex: 2
            },
            {
              field: "privilegeType",
              headerName: "Type",
              valueGetter: (params) => {
                const result = Object.entries(UserType).filter(
                  (type) => type[0] === params.row.user.privilegeType.toString()
                )[0][1] as string;

                return result.charAt(0) + result.substring(1).toLowerCase();
              },
              flex: 1
            },
            {
              field: "createdAt",
              headerName: "Created At",
              flex: 1,
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
              filterHandler: (data, value) =>
                data.user.userDetail.firstName.toLowerCase().includes(value.toLowerCase()) ||
                data.user.userDetail.lastName.toLowerCase().includes(value.toLowerCase())
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
      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Student"
        onSuccess={submitHandler}
        submitApi={API.GetAllUser}
      />
    </PageContainer>
  );
};

export default UserPage;
