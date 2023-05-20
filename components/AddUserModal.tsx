/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useApiTransformer } from "@sonamusica-fe/api";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import Select from "@sonamusica-fe/components/Form/Select";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import Modal from "@sonamusica-fe/components/Modal";
import { User, UserType } from "@sonamusica-fe/types";
import { required, validEmail } from "@sonamusica-fe/utils/ValidationUtil";
import { FailedResponse, SuccessResponse } from "api";
import { useEffect, useState } from "react";

type AddUserModalProps = {
  title?: string;
  open?: boolean;
  onClose: () => void;
  onSuccess: (newData: User) => void;
  submitApi: (...data: any) => Promise<FailedResponse | SuccessResponse<any>>;
  data?: any;
};

const AddUserModal = ({
  title,
  onSuccess,
  open = false,
  onClose,
  submitApi,
  data
}: AddUserModalProps): JSX.Element => {
  const options = [UserType.ADMIN, UserType.STAFF, UserType.MEMBER];

  const apiTransformer = useApiTransformer();

  const [loading, setLoading] = useState<boolean>(false);

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
  const [errorLastName, setErrorLastName] = useState<string>("");

  const submitHandler = () => {
    if (!required(email)) setErrorEmail("Email is required!");
    else if (!validEmail(email)) setErrorEmail("Email is not valid!");
    else setErrorEmail("");

    if (!required(username)) setErrorUsername("Username is required!");
    else setErrorUsername("");

    if (!required(password)) setErrorPassword("Password is required!");
    else setErrorPassword("");

    if (!required(confirmPassword)) setErrorConfirmPassword("Confirm Password is required!");
    else if (confirmPassword !== password)
      setErrorConfirmPassword("Confirm Password and Password does not match!");
    else setErrorUsername("");

    if (!required(privilegeType?.toString())) setErrorPrivilegeType("User Type is required!");
    else setErrorPrivilegeType("");

    if (!required(firstName)) setErrorFirstName("First Name is required!");
    else setErrorUsername("");

    if (
      errorEmail &&
      errorPassword &&
      errorConfirmPassword &&
      errorPrivilegeType &&
      errorUsername &&
      errorFirstName
    )
      return;

    submitApi(1, 100).then((response) => {
      apiTransformer(response, false);
      console.log(response);
    });
  };

  useEffect(() => {
    if (data) {
      setEmail((data as User).email);
      setUsername((data as User).username);
      setPrivilegeType((data as User).privilegeType);
      setFirstName((data as User).userDetail.firstName);
      setLastName((data as User).userDetail.lastName);
    }
  }, [data]);

  return (
    <Modal closeIcon open={open} onClose={onClose}>
      {title !== undefined && (
        <Typography align="center" variant="h4" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
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
              onClick={onClose}
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormField>
        {data === undefined && (
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            onChange={(e) => setFirstName(e.target.value)}
            testIdContext="UserUpsertFirstName"
          />
        </FormField>
        <FormField lg={4} md={6} sx={{ pt: "8px !important" }}>
          <TextInput
            label="Last Name"
            type="text"
            value={lastName}
            errorMsg={errorLastName}
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
              if (value !== null) {
                setPrivilegeType(value);
              }
            }}
          />
        </FormField>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
