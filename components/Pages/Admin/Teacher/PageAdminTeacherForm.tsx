import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Teacher, UserType, User } from "@sonamusica-fe/types";
import { TeacherInsertFormData } from "@sonamusica-fe/types/form/teacher";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import React, { useEffect, useMemo, useState } from "react";

type PageAdminTeacherFormProps = {
  data: Teacher[];
  setData: (newData: Teacher[]) => void;
  onClose: () => void;
  open: boolean;
};

const options = [UserType.ADMIN, UserType.STAFF, UserType.MEMBER];

const errorResponseMapping = {
  username: "username",
  privilegeType: "privilegeType",
  firstName: "firstName"
};

const PageAdminTeacherForm = ({
  data,
  setData,
  onClose,
  open
}: PageAdminTeacherFormProps): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    API.GetAllUser({ filter: "NOT_TEACHER" }).then((response) => {
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
      privilegeType: UserType.MEMBER
    };
  }, [selectedUser, open]);

  useEffect(() => {
    setSelectedUser(null);
  }, [open]);

  const insertFields: FormFieldType<TeacherInsertFormData>[] = [
    {
      type: "select",
      name: "userId",
      label: "=== Select User ===",
      formFieldProps: { lg: 12, md: 12 },
      validations: [],
      selectProps: {
        options: users,
        getOptionLabel: (option) => getFullNameFromUser(option),
        isOptionEqualToValue: (option, value) => option?.userId === value?.userId,
        onChange: (valueRef, errorRef, _e, value) => {
          setSelectedUser(value);
          if (value)
            valueRef.current = {
              userId: value,
              email: value.email,
              username: value.username,
              firstName: value.userDetail.firstName,
              lastName: value.userDetail.lastName,
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
            userId: ""
          };
        }
      }
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      formFieldProps: { lg: 6, md: 6 },
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
      formFieldProps: { lg: 6, md: 6 },
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
          }
        ] as FormFieldType<TeacherInsertFormData>[])
      : []),
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
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
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
      inputProps: { disabled: Boolean(selectedUser) },
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
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "required" }]
    }
  ];

  const { formProperties, formRenderer } = useFormRenderer<TeacherInsertFormData>(
    {
      testIdContext: "TeacherUpsert",
      submitContainerProps: { align: "space-between", spacing: 3 },
      cancelButtonProps: {
        startIcon: <Cancel />,
        onClick: onClose
      },
      promptCancelButtonDialog: true,
      submitButtonProps: { endIcon: <Save /> },
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

        let request: Promise<FailedResponse | SuccessResponse<Teacher>>;

        if (selectedUser && formData.userId) {
          request = API.InsertTeacher([{ userId: formData.userId.userId }]);
        } else {
          request = API.InsertTeacherNewUser([
            {
              email: formData.email,
              username: formData.username,
              password: formData.password,
              privilegeType: formData.privilegeType,
              userDetail: {
                firstName: formData.firstName,
                lastName: formData.lastName
              }
            }
          ]);
        }
        const response = await request;
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<Teacher>).results[0];
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
        Add Teacher
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminTeacherForm;
