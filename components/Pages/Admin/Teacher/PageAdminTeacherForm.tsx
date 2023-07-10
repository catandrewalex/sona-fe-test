import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormDirtyStatus,
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Teacher, UserType, TeacherInsertFormData, User } from "@sonamusica-fe/types";
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
    API.GetAllUser().then((response) => {
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
        getOptionLabel: (option) =>
          `${option.userDetail?.firstName} ${option.userDetail?.lastName || ""} - ${option.email}`,
        testIdContext: "UserUpsertPrivilegeType",
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
            formProperties.dirtyRef.current = FormDirtyStatus.CLEAN;
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
        testIdContext: "UserUpsertUsername",
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
        testIdContext: "UserUpsertUsername",
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
        testIdContext: "UserUpsertFirstName",
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
      inputProps: { testIdContext: "UserUpsertLastName", disabled: Boolean(selectedUser) },
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
        testIdContext: "UserUpsertPrivilegeType",
        disabled: Boolean(selectedUser)
      },
      validations: [{ name: "required" }]
    }
  ];

  const { formProperties, formRenderer } = useFormRenderer<TeacherInsertFormData>(
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
          let found = false;
          let newData = data.map((val) => {
            if (val.teacherId === responseData.teacherId) {
              found = true;
              return responseData;
            }
            return val;
          });
          if (!found) newData = [responseData, ...newData];
          setData(
            newData.sort((a, b) =>
              a.teacherId < b.teacherId ? -1 : a.teacherId === b.teacherId ? 0 : 1
            )
          );
          onClose();
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
