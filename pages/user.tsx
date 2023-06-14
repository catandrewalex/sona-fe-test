import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { User, UserType } from "@sonamusica-fe/types";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import Table from "@sonamusica-fe/components/Table";
import { Typography } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import Select from "@sonamusica-fe/components/Form/Select";
import TableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import Modal from "@sonamusica-fe/components/Modal";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import moment from "moment";
import {
  useCheckEmail,
  useCheckMatch,
  useCheckRequired
} from "@sonamusica-fe/utils/ValidationUtil";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import TempUser from "@sonamusica-fe/components/TempUser";

const UserPage = (): JSX.Element => {
  const [data, setData] = useState<Array<User>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<User>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const { showDialog } = useAlertDialog();
  const apiTransformer = useApiTransformer();

  const onClose = useCallback(() => {
    setOpen(false);
    setSelectedData(undefined);
  }, []);

  useEffect(() => {
    API.GetAllUser()
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          setData((parsedResponse as ResponseMany<User>).results);
        }
      })
      .finally(() => {
        finishLoading();
        setLoading(false);
      });
  }, [user]);

  /*
  Add new row to datagrid:apiRef.current.updateRows([createRandomRow()]);
  */

  return (
    <PageContainer navTitle="User">
      <TableContainer>
        <Table
          getRowId={(row) => row.userId}
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
      <TempUser
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        open={open}
        onClose={onClose}
        data={data}
        setData={setData}
      />
    </PageContainer>
  );
};

export default UserPage;
