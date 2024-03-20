import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { User, UserType } from "@sonamusica-fe/types";
import {
  UserInsertFormData,
  UserUpdateFormData,
  UserUpdateFormRequest,
  UserInsertFormRequest
} from "@sonamusica-fe/types/form/admin/user";
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
    inputProps: { type: "email" },
    validations: [{ name: "email" }]
  },
  {
    type: "text",
    name: "username",
    label: "Username",
    formFieldProps: { lg: 6, md: 6 },
    inputProps: { required: true },
    validations: [{ name: "required" }]
  },
  {
    type: "text",
    name: "password",
    label: "Password",
    formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
    inputProps: { type: "password" },
    validations: []
  },
  {
    type: "text",
    name: "passwordConfirm",
    label: "Confirm Password",
    formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
    inputProps: { type: "password" },
    validations: [
      { name: "match", parameters: { matcherField: "password", matcherLabel: "Password" } }
    ]
  },
  {
    type: "text",
    name: "firstName",
    label: "First Name",
    formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
    inputProps: { required: true },
    validations: [{ name: "required" }]
  },
  {
    type: "text",
    name: "lastName",
    label: "Last Name",
    formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
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
      getOptionLabel: (option) => UserType[option]
    },
    validations: [{ name: "required" }]
  }
];

const updateFields: FormFieldType<UserUpdateFormData>[] = insertFields.filter(
  (field) => field.name !== "password" && field.name !== "passwordConfirm"
) as FormFieldType<UserUpdateFormData>[];

updateFields.push({
  type: "switch",
  name: "isActive",
  label: "Active?",
  formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
  validations: [{ name: "required" }]
});

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
          testIdContext: "UserUpsert",
          cancelButtonProps: {
            onClick: onClose
          },
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
              },
              isDeactivated: !formData.isActive
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
        { ...defaultFieldValue, isActive: false }
      )
    : useFormRenderer<UserInsertFormData>(
        {
          testIdContext: "UserUpsert",
          cancelButtonProps: {
            onClick: onClose
          },
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
              const newData = [...data, responseData];
              setData(newData);
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
        privilegeType: selectedData.privilegeType,
        isActive: !selectedData.isDeactivated
      };
      formProperties.errorRef.current = {} as Record<keyof UserUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose} disableEscape>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} User
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminUserForm;
