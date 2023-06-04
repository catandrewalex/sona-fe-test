import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { Teacher, User, UserType } from "@sonamusica-fe/types";
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
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import {
  useCheckRequired,
  useCheckEmail,
  useCheckMatch
} from "@sonamusica-fe/utils/ValidationUtil";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";

const options = [UserType.ADMIN, UserType.STAFF, UserType.MEMBER];

const TeacherPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Teacher>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<User | null>(null);

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const { showDialog } = useAlertDialog();
  const apiTransformer = useApiTransformer();

  // ==================== For Form in Modal (UPSERT) ==================== //
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [privilegeType, setPrivilegeType] = useState<UserType | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPrivilegeType, setErrorPrivilegeType] = useState<string>("");
  const [errorFirstName, setErrorFirstName] = useState<string>("");

  // ==================== For Field Validation ==================== //
  const checkEmailRequired = useCheckRequired(setErrorEmail, "Email");
  const checkEmailValid = useCheckEmail(setErrorEmail, "Email");
  const checkUsername = useCheckRequired(setErrorUsername, "Username");
  const checkPassword = useCheckRequired(setErrorPassword, "Password");
  const checkPasswordConfirmationRequired = useCheckRequired(
    setErrorConfirmPassword,
    "Confirmation Password"
  );
  const checkPasswordConfirmationMatch = useCheckMatch(
    setErrorConfirmPassword,
    "Password & Confirmation Password"
  );
  const checkPrivilegeType = useCheckRequired(setErrorPrivilegeType, "User Type");
  const checkFirstName = useCheckRequired(setErrorFirstName, "First Name");

  const onClose = useCallback(() => {
    setOpen(false);
    setSelectedData(null);
  }, []);

  const resetErrorMessage = useCallback(() => {
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirmPassword("");
    setErrorUsername("");
    setErrorPrivilegeType("");
    setErrorFirstName("");
  }, []);

  const mappingResponseHandler: Array<{
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: Dispatch<SetStateAction<any>>;
  }> = useMemo(() => {
    return [
      {
        name: "userPrivilegeType",
        handler: setErrorPrivilegeType
      },
      {
        name: "email",
        handler: setErrorEmail
      },
      {
        name: "username",
        handler: setErrorUsername
      },
      {
        name: "firstName",
        handler: setErrorFirstName
      },
      {
        name: "password",
        handler: setErrorPassword
      }
    ];
  }, []);

  useEffect(() => {
    if (user) {
      API.GetAllTeacher()
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Teacher>).results);
            API.GetAllUser().then((userResponse) => {
              const userParsedResponse = apiTransformer(userResponse, false);
              if (Object.getPrototypeOf(userParsedResponse) !== FailedResponse.prototype) {
                setUsers((userParsedResponse as ResponseMany<User>).results);
              }
            });
          }
        })
        .finally(() => {
          finishLoading();
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setUsername("");
      setPrivilegeType(null);
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
      resetErrorMessage();
    }
  }, [open]);

  const submitHandler = () => {
    let finalCheckEmail = true,
      finalCheckPassword = true,
      finalCheckPasswordConfirm = true,
      finalCheckUsername = true,
      finalCheckFirstName = true,
      finalCheckPrivilegeType = true;

    if (!selectedData) {
      finalCheckEmail = checkEmailRequired(email);
      if (finalCheckEmail) finalCheckEmail = checkEmailValid(email);

      finalCheckUsername = checkUsername(username);
      finalCheckFirstName = checkFirstName(firstName);
      finalCheckPrivilegeType = checkPrivilegeType(privilegeType?.toString() || "");

      finalCheckPassword = checkPassword(password);

      finalCheckPasswordConfirm = checkPasswordConfirmationRequired(confirmPassword);
      if (finalCheckPasswordConfirm)
        finalCheckPasswordConfirm = checkPasswordConfirmationMatch(password, confirmPassword);
    }

    if (
      finalCheckEmail &&
      finalCheckUsername &&
      finalCheckFirstName &&
      finalCheckPrivilegeType &&
      finalCheckPassword &&
      finalCheckPasswordConfirm
    ) {
      setLoading(true);

      let request: Promise<FailedResponse | SuccessResponse<Teacher>>;

      if (selectedData) {
        request = API.InsertTeacher([{ userId: selectedData.id }]);
      } else {
        request = API.InsertTeacherNewUser([
          {
            email,
            password,
            username,
            privilegeType: privilegeType ? privilegeType : undefined,
            userDetail: { lastName, firstName }
          }
        ]);
      }

      request
        .then((response) => {
          const parsedResponse = apiTransformer(response, true);

          // MAP EACH ERROR MESSAGE TO ITS CORESPONDING FIELD
          if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
            Object.entries((parsedResponse as FailedResponse).errors).forEach((error) => {
              const mappingFound = mappingResponseHandler.filter((mapping) =>
                error[0].includes(mapping.name)
              );
              if (mappingFound.length > 0) {
                const idx = error[1].indexOf(mappingFound[0].name);
                mappingFound[0].handler(
                  error[1].charAt(idx).toUpperCase() + error[1].substring(idx + 1)
                );
              }
            });
          } else {
            const responseData = (parsedResponse as ResponseMany<Teacher>).results[0];
            const newData = [...data, { ...responseData }];
            setData(
              newData.sort((a, b) =>
                a.teacherId < b.teacherId ? -1 : a.teacherId === b.teacherId ? 0 : 1
              )
            );
            onClose();
          }
        })
        .finally(() => setLoading(false));
    }
  };

  /*
  Add new row to datagrid:apiRef.current.updateRows([createRandomRow()]);
  */

  return (
    <PageContainer navTitle="Teacher">
      <TableContainer>
        <Table
          name="Teacher"
          loading={loading}
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={() => setOpen(true)}
          rows={data}
          getRowId={(row) => row.teacherId}
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
      <Modal closeIcon open={open} onClose={onClose}>
        <Typography align="center" variant="h4" sx={{ mb: 2 }}>
          Add Teacher
        </Typography>
        <Form
          onSubmit={submitHandler}
          formSubmit={
            <SubmitButtonContainer align="space-between" spacing={3}>
              <SubmitButton
                align="center"
                regular
                submitText="Cancel"
                variant="outlined"
                color="error"
                fullWidth
                disabled={loading}
                onClick={() => {
                  showDialog(
                    { title: "Unsaved Data", content: "Are you sure to delete changes?" },
                    onClose
                  );
                }}
                testIdContext="UserUpsertCancel"
                startIcon={<Cancel />}
              />
              <SubmitButton
                endIcon={<Save />}
                loading={loading}
                fullWidth
                testIdContext="UserUpsertSubmit"
              />
            </SubmitButtonContainer>
          }
        >
          <FormField lg={12} md={12}>
            <Select
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              options={users}
              getOptionLabel={(option) =>
                `${option.userDetail.firstName} ${option.userDetail.lastName} - ${option.email}`
              }
              value={selectedData}
              onChange={(_e, value) => {
                setSelectedData(value);
                resetErrorMessage();
              }}
              inputProps={{ label: "--- Select User ---" }}
            />
          </FormField>
          <FormField lg={6} md={6}>
            <TextInput
              testIdContext="UserUpsertEmail"
              label="Email"
              type="email"
              required
              value={selectedData ? selectedData.email : email}
              errorMsg={errorEmail}
              disabled={loading || selectedData !== null}
              onChange={(e) => {
                setEmail(e.target.value);
                if (checkEmailRequired(e.target.value)) checkEmailValid(e.target.value);
              }}
            />
          </FormField>
          <FormField lg={6} md={6}>
            <TextInput
              testIdContext="UserUpsertUsername"
              label="Username"
              type="text"
              required
              value={selectedData ? selectedData.username : username}
              errorMsg={errorUsername}
              disabled={loading || selectedData !== null}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsername(e.target.value);
              }}
            />
          </FormField>
          {selectedData === null && (
            <>
              <FormField lg={6} md={6} sx={{ pt: "8px !important" }}>
                <TextInput
                  testIdContext="UserUpsertPassword"
                  label="Password"
                  type="password"
                  required
                  value={password}
                  errorMsg={errorPassword}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPassword(e.target.value);
                  }}
                />
              </FormField>
              <FormField lg={6} md={6} sx={{ pt: "8px !important" }}>
                <TextInput
                  label="Confirm Password"
                  type="password"
                  required
                  value={confirmPassword}
                  errorMsg={errorConfirmPassword}
                  disabled={loading}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (checkPasswordConfirmationRequired(e.target.value))
                      checkPasswordConfirmationMatch(password, e.target.value);
                  }}
                  testIdContext="UserUpsertConfirmPassword"
                />
              </FormField>
            </>
          )}
          <FormField lg={4} md={6} sx={{ pt: "8px !important" }}>
            <TextInput
              label="First Name"
              type="text"
              required
              value={selectedData ? selectedData.userDetail.firstName : firstName}
              errorMsg={errorFirstName}
              disabled={loading || selectedData !== null}
              onChange={(e) => {
                setFirstName(e.target.value);
                checkFirstName(e.target.value);
              }}
              testIdContext="UserUpsertFirstName"
            />
          </FormField>
          <FormField lg={4} md={6} sx={{ pt: "8px !important" }}>
            <TextInput
              label="Last Name"
              type="text"
              value={selectedData ? selectedData.userDetail.lastName : lastName}
              disabled={loading || selectedData !== null}
              onChange={(e) => setLastName(e.target.value)}
              testIdContext="UserUpsertLastName"
            />
          </FormField>
          <FormField lg={4} md={6} sx={{ pt: "8px !important" }}>
            <Select
              options={options}
              value={selectedData ? selectedData.privilegeType : privilegeType}
              errorMsg={errorPrivilegeType}
              disabled={loading || selectedData !== null}
              getOptionLabel={(option) => UserType[option]}
              testIdContext="UserUpsertPrivilegeType"
              inputProps={{ label: "User Type", required: true }}
              onChange={(_e, value) => {
                setPrivilegeType(value);
                checkPrivilegeType(value?.toString() || "");
              }}
            />
          </FormField>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TeacherPage;
