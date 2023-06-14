import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import Select from "@sonamusica-fe/components/Form/Select";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import Modal from "@sonamusica-fe/components/Modal";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { User, UserType } from "@sonamusica-fe/types";
import {
  useCheckRequired,
  useCheckEmail,
  useCheckMatch
} from "@sonamusica-fe/utils/ValidationUtil";
import { FailedResponse, ResponseMany } from "api";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

type TempUserProps = {
  selectedData?: User;
  setSelectedData: (newUser?: User) => void;
  data: User[];
  setData: (newUser: User[]) => void;
  open: boolean;
  onClose: () => void;
};
const options = [UserType.ADMIN, UserType.STAFF, UserType.MEMBER];

const TempUser = ({
  selectedData,
  setSelectedData,
  data,
  setData,
  open,
  onClose
}: TempUserProps) => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  const [loading, setLoading] = useState<boolean>(false);
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
    if (selectedData) {
      setEmail((selectedData as User).email);
      setUsername((selectedData as User).username);
      setPrivilegeType((selectedData as User).privilegeType);
      setFirstName((selectedData as User).userDetail.firstName);
      setLastName((selectedData as User).userDetail.lastName || "");
    }
  }, [selectedData]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setUsername("");
      setPrivilegeType(null);
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
      setErrorEmail("");
      setErrorPassword("");
      setErrorConfirmPassword("");
      setErrorUsername("");
      setErrorPrivilegeType("");
      setErrorFirstName("");
    }
  }, [open]);

  const submitHandler = () => {
    let finalCheckEmail: boolean = checkEmailRequired(email),
      finalCheckPassword = true,
      finalCheckPasswordConfirm = true;
    if (finalCheckEmail) finalCheckEmail = checkEmailValid(email);

    const finalCheckUsername = checkUsername(username),
      finalCheckFirstName = checkFirstName(firstName),
      finalCheckPrivilegeType = checkPrivilegeType(privilegeType?.toString() || "");

    if (!selectedData) {
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
      const payload: Partial<User & { password: string }> = {
        userId: selectedData?.userId,
        email,
        username,
        privilegeType: privilegeType ? privilegeType : undefined,
        userDetail: {
          firstName,
          lastName
        },
        password: password === "" ? undefined : password
      };

      const request = selectedData ? API.UpdateUser([payload]) : API.CreateUser([payload]);
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
            const responseData = (parsedResponse as ResponseMany<User>).results[0];
            let found = false;
            const newData = data.map((val) => {
              if (val.userId === responseData.userId) {
                found = true;
                return responseData;
              }
              return val;
            });
            if (!found) newData.push(responseData);
            setData(
              newData.sort((a, b) => (a.userId < b.userId ? -1 : a.userId === b.userId ? 0 : 1))
            );
            onClose();
          }
        })
        .finally(() => setLoading(false));
    }
  };
  return (
    <Modal closeIcon open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} User
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
        <FormField lg={6} md={6}>
          <TextInput
            testIdContext="UserUpsertEmail"
            label="Email"
            type="email"
            required
            value={email}
            errorMsg={errorEmail}
            disabled={loading}
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
            value={username}
            errorMsg={errorUsername}
            disabled={loading}
            onChange={(e) => {
              setUsername(e.target.value);
              checkUsername(e.target.value);
            }}
          />
        </FormField>
        {selectedData === undefined && (
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
            value={firstName}
            errorMsg={errorFirstName}
            disabled={loading}
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
            value={lastName}
            disabled={loading}
            onChange={(e) => setLastName(e.target.value)}
            testIdContext="UserUpsertLastName"
          />
        </FormField>
        <FormField lg={4} md={6} sx={{ pt: "8px !important" }}>
          <Select
            options={options}
            value={privilegeType}
            errorMsg={errorPrivilegeType}
            disabled={loading}
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
  );
};

export default TempUser;
