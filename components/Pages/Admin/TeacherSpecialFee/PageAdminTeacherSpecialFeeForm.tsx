import { Cancel, Save } from "@mui/icons-material";
import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { TeacherSpecialFee, Teacher, Course } from "@sonamusica-fe/types";
import {
  TeacherSpecialFeeInsertFormData,
  TeacherSpecialFeeUpdateFormData
} from "@sonamusica-fe/types/form/teacher-special-fee";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminTeacherSpecialFeeFormProps = {
  data: TeacherSpecialFee[];
  teacherData: Teacher[];
  courseData: Course[];
  setData: (newData: TeacherSpecialFee[]) => void;
  selectedData: TeacherSpecialFee | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  teacher: "teacher",
  course: "course",
  fee: "fee"
};

const PageAdminTeacherSpecialFeeForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  courseData,
  teacherData
}: PageAdminTeacherSpecialFeeFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultInsertFields: FormFieldType<TeacherSpecialFeeInsertFormData>[] = [
    {
      type: "select",
      name: "teacher",
      label: "Teacher",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: teacherData,
        getOptionLabel: (option) =>
          `${option.user.userDetail?.firstName} ${option.user.userDetail?.lastName || ""}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "course",
      label: "Course",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: courseData,
        getOptionLabel: (option) => `${option.instrument.name} ${option.grade.name}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "fee",
      label: "Fee",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }]
    }
  ];

  const defaultUpdateFields: FormFieldType<TeacherSpecialFeeUpdateFormData>[] = [
    {
      type: "text",
      name: "fee",
      label: "Fee",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }]
    }
  ];

  const defaultUpdateFieldValue: TeacherSpecialFeeUpdateFormData = {
    fee: 0
  };

  const defaultInsertFieldValue: TeacherSpecialFeeInsertFormData = {
    ...defaultUpdateFieldValue,
    teacher: null,
    course: null
  };

  const { formProperties, formRenderer } = selectedData
    ? useFormRenderer<TeacherSpecialFeeUpdateFormData>(
        {
          testIdContext: "TeacherSpecialFeeUpsert",
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save /> },
          fields: defaultUpdateFields,
          submitHandler: async ({ fee }, error) => {
            if (error.fee) return Promise.reject();
            const response = await API.UpdateTeacherSpecialFee([
              { teacherSpecialFeeId: selectedData.teacherSpecialFeeId, fee }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<TeacherSpecialFee>).results[0];
              const newData = data.map((val) => {
                if (val.teacherSpecialFeeId === responseData.teacherSpecialFeeId) {
                  return responseData;
                }
                return val;
              });
              setData(newData);
            }
          }
        },
        defaultUpdateFieldValue
      )
    : useFormRenderer<TeacherSpecialFeeInsertFormData>(
        {
          testIdContext: "TeacherSpecialFeeUpsert",
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save /> },
          fields: defaultInsertFields,
          errorResponseMapping,
          submitHandler: async ({ fee, teacher, course }, error) => {
            if (error.fee || error.teacher || error.course) return Promise.reject();
            const response = await API.InsertTeacherSpecialFee([
              {
                fee,
                teacherId: teacher?.teacherId || 0,
                courseId: course?.courseId || 0
              }
            ]);

            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<TeacherSpecialFee>).results[0];
              setData([...data, responseData]);
            }
          }
        },
        defaultInsertFieldValue
      );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        fee: selectedData.fee
      };
      formProperties.errorRef.current = {} as Record<keyof TeacherSpecialFeeUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Teacher Special Fee
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminTeacherSpecialFeeForm;
