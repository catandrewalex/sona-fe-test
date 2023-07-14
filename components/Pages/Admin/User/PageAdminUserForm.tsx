import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import {
  User,
  UserInsertFormData,
  UserInsertFormRequest,
  UserType,
  UserUpdateFormData,
  UserUpdateFormRequest
} from "@sonamusica-fe/types";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminUserFormProps = {
  data: User[];
  setData: (newData: User[]) => void;
  selectedData: User | undefined;
  onClose: () => void;
  open: boolean;
};

const options = [UserType.ADMIN, UserType.STAFF, UserType.MEMBER];

const errorResponseMapping = {
  username: "username",
  privilegeType: "privilegeType",
  firstName: "firstName"
};

const insertFields: FormFieldType<UserInsertFormData>[] = [
  {
    type: "text",
    name: "email",
    label: "Email",
    formFieldProps: { lg: 6, md: 6 },
    inputProps: { testIdContext: "UserUpsertUsername", type: "email" },
    validations: [{ name: "email" }]
  },
  {
    type: "text",
    name: "username",
    label: "Username",
    formFieldProps: { lg: 6, md: 6 },
    inputProps: { required: true, testIdContext: "UserUpsertUsername" },
    validations: [{ name: "required" }]
  },
  {
    type: "text",
    name: "password",
    label: "Password",
    formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
    inputProps: { testIdContext: "UserUpsertPassword", type: "password" },
    validations: []
  },
  {
    type: "text",
    name: "passwordConfirm",
    label: "Confirm Password",
    formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
    inputProps: { testIdContext: "UserUpsertPassword", type: "password" },
    validations: [
      { name: "match", parameters: { matcherField: "password", matcherLabel: "Password" } }
    ]
  },
  {
    type: "text",
    name: "firstName",
    label: "First Name",
    formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
    inputProps: { required: true, testIdContext: "UserUpsertFirstName" },
    validations: [{ name: "required" }]
  },
  {
    type: "text",
    name: "lastName",
    label: "Last Name",
    formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
    inputProps: { testIdContext: "UserUpsertLastName" },
    validations: []
  },
  {
    type: "select",
    name: "privilegeType",
    label: "Privilege Type",
    formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
    inputProps: { required: true },
    selectProps: {
      options,
      getOptionLabel: (option) => UserType[option],
      testIdContext: "UserUpsertPrivilegeType"
    },
    validations: [{ name: "required" }]
  }
];

const updateFields: FormFieldType<UserInsertFormData>[] = insertFields.filter(
  (field) => field.name !== "password" && field.name !== "passwordConfirm"
);

const PageAdminUserForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open
}: PageAdminUserFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultFieldValue: UserInsertFormData = {
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    privilegeType: UserType.MEMBER
  };

  const { formProperties, formRenderer } = selectedData
    ? useFormRenderer<UserUpdateFormData>(
        {
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            testIdContext: "UserUpsertCancel",
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save />, testIdContext: "UserUpsertSubmit" },
          fields: updateFields,
          errorResponseMapping,
          submitHandler: async (formData, error) => {
            if (error.email || error.username || error.firstName || error.privilegeType)
              return Promise.reject();

            const payload: UserUpdateFormRequest = {
              userId: selectedData.userId,
              email: formData.email,
              username: formData.username,
              privilegeType: formData.privilegeType,
              userDetail: {
                firstName: formData.firstName,
                lastName: formData.lastName
              }
            };
            const response = await API.UpdateUser([payload]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<User>).results[0];
              const newData = data.map((val) => {
                if (val.userId === responseData.userId) {
                  return responseData;
                }
                return val;
              });
              setData(newData);
            }
          }
        },
        defaultFieldValue
      )
    : useFormRenderer<UserInsertFormData>(
        {
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            testIdContext: "UserUpsertCancel",
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save />, testIdContext: "UserUpsertSubmit" },
          fields: insertFields,
          errorResponseMapping,
          submitHandler: async (formData, error) => {
            if (
              error.email ||
              error.username ||
              error.password ||
              error.passwordConfirm ||
              error.firstName ||
              error.privilegeType
            )
              return Promise.reject();

            const payload: UserInsertFormRequest = {
              email: formData.email,
              username: formData.username,
              password: formData.password,
              privilegeType: formData.privilegeType,
              userDetail: {
                firstName: formData.firstName,
                lastName: formData.lastName
              }
            };
            const response = await API.CreateUser([payload]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<User>).results[0];
              const newData = [responseData, ...data];
              setData(newData);
              onClose();
            }
          }
        },
        defaultFieldValue
      );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        firstName: selectedData.userDetail.firstName,
        lastName: selectedData.userDetail.lastName,
        email: selectedData.email,
        username: selectedData.username,
        privilegeType: selectedData.privilegeType
      };
      formProperties.errorRef.current = {} as Record<keyof UserUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} User
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminUserForm;
