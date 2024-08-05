import { Typography } from "@mui/material";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Student, UserType, User } from "@sonamusica-fe/types";
import { StudentInsertFormData } from "@sonamusica-fe/types/form/admin/student";
import { convertMomentDateToRFC3339, getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";

type PageAdminStudentFormProps = {
  data: Student[];
  setData: (newData: Student[]) => void;
  onClose: () => void;
  open: boolean;
};

const options = [UserType.ADMIN, UserType.STAFF, UserType.MEMBER];

const errorResponseMapping = {
  username: "username",
  privilegeType: "privilegeType",
  firstName: "firstName"
};

const PageAdminStudentModalForm = ({
  data,
  setData,
  onClose,
  open
}: PageAdminStudentFormProps): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    ADMIN_API.GetAllUser({ filter: "NOT_STUDENT" }).then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        setUsers((parsedResponse as ResponseMany<User>).results);
      }
    });
  }, []);

  const defaultFieldValue = useMemo(() => {
    return {
      userId: null,
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",

      birthdate: null,
      address: "",
      phoneNumber: "",
      instagramAccount: "",
      twitterAccount: "",
      parentName: "",
      parentPhoneNumber: "",

      privilegeType: UserType.MEMBER
    };
  }, []);

  useEffect(() => {
    setSelectedUser(null);
  }, [open]);

  const insertFields: FormFieldType<StudentInsertFormData>[] = [
    {
      type: "select",
      name: "userId",
      label: "=== Select User ===",
      formFieldProps: { lg: 12, md: 12, sm: 12, xs: 12 },
      validations: [],
      selectProps: {
        options: users,
        getOptionLabel: (option) => getFullNameFromUser(option),
        isOptionEqualToValue: (option, value) => option?.userId === value?.userId,
        onChange: (valueRef, errorRef, _e, value) => {
          setSelectedUser(value);
          if (value)
            valueRef.current = {
              userId: value.userId,
              email: value.email,
              username: value.username,
              firstName: value.userDetail.firstName,
              lastName: value.userDetail.lastName,
              birthdate: value.userDetail.birthdate ? moment(value.userDetail.birthdate) : null,
              address: value.userDetail.address,
              phoneNumber: value.userDetail.phoneNumber,
              instagramAccount: value.userDetail.instagramAccount,
              twitterAccount: value.userDetail.twitterAccount,
              parentName: value.userDetail.parentName,
              parentPhoneNumber: value.userDetail.parentPhoneNumber,
              privilegeType: value.privilegeType
            };
          else {
            valueRef.current = {
              userId: null,
              email: "",
              username: "",
              password: "",
              passwordConfirm: "",
              firstName: "",
              lastName: "",
              birthdate: null,
              address: "",
              phoneNumber: "",
              instagramAccount: "",
              twitterAccount: "",
              parentName: "",
              parentPhoneNumber: "",
              privilegeType: UserType.MEMBER
            };
            formProperties.hasUnsavedChangesRef.current = false;
          }

          errorRef.current = {
            email: "",
            username: "",
            password: "",
            passwordConfirm: "",
            firstName: "",
            privilegeType: "",
            lastName: "",
            birthdate: "",
            address: "",
            phoneNumber: "",
            instagramAccount: "",
            twitterAccount: "",
            parentName: "",
            parentPhoneNumber: "",
            userId: ""
          };
        }
      }
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      formFieldProps: { lg: 6 },
      inputProps: {
        type: "email",
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "email" }]
    },
    {
      type: "text",
      name: "username",
      label: "Username",
      formFieldProps: { lg: 6, sx: { pt: { xs: "8px !important", sm: "24px !important" } } }, // on "xs", this field is no longer the top-most row, so we need to use the same "pt" as other fields.
      inputProps: {
        required: true,
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "required" }]
    },
    ...(!selectedUser
      ? ([
          {
            type: "text",
            name: "password",
            label: "Password",
            formFieldProps: { lg: 6, sx: { pt: "8px !important" } },
            inputProps: { type: "password" },
            validations: []
          },
          {
            type: "text",
            name: "passwordConfirm",
            label: "Confirm Password",
            formFieldProps: { lg: 6, sx: { pt: "8px !important" } },
            inputProps: { type: "password" },
            validations: [
              { name: "match", parameters: { matcherField: "password", matcherLabel: "Password" } }
            ]
          }
        ] as FormFieldType<StudentInsertFormData>[])
      : []),
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "date",
      name: "birthdate",
      label: "Birthdate",
      formFieldProps: { sx: { pt: "8px !important" } },
      dateProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "text",
      name: "address",
      label: "Address",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "text",
      name: "phoneNumber",
      label: "Phone Number",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "text",
      name: "instagramAccount",
      label: "Instagram Account",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "text",
      name: "twitterAccount",
      label: "Twitter Account",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "text",
      name: "parentName",
      label: "Parent Name",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "text",
      name: "parentPhoneNumber",
      label: "Parent Phone Number",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
      validations: []
    },
    {
      type: "select",
      name: "privilegeType",
      label: "Privilege Type",
      formFieldProps: { sx: { pt: "8px !important" } },
      inputProps: { required: true },
      selectProps: {
        options,
        getOptionLabel: (option) => UserType[option],
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "required" }]
    }
  ];

  const { formProperties, formRenderer } = useFormRenderer<StudentInsertFormData>(
    {
      testIdContext: "StudentUpsert",
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

        let request: Promise<FailedResponse | SuccessResponse<Student>>;

        if (selectedUser && formData.userId) {
          request = ADMIN_API.InsertStudent([{ userId: formData.userId.userId }]);
        } else {
          request = ADMIN_API.InsertStudentNewUser([
            {
              email: formData.email,
              username: formData.username,
              password: formData.password,
              privilegeType: formData.privilegeType,
              userDetail: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthdate: formData.birthdate
                  ? convertMomentDateToRFC3339(formData.birthdate)
                  : undefined,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                instagramAccount: formData.instagramAccount,
                twitterAccount: formData.twitterAccount,
                parentName: formData.parentName,
                parentPhoneNumber: formData.parentPhoneNumber
              }
            }
          ]);
        }
        const response = await request;
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<Student>).results[0];
          const newData = [...data, responseData];
          setData(newData);
        }
      }
    },
    defaultFieldValue
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        Add Student
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminStudentModalForm;
