import { InputAdornment, Typography } from "@mui/material";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { TeacherSpecialFee, Teacher, Course } from "@sonamusica-fe/types";
import {
  TeacherSpecialFeeInsertFormData,
  TeacherSpecialFeeUpdateFormData
} from "@sonamusica-fe/types/form/admin/teacher-special-fee";
import { getCourseName, getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
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

const PageAdminTeacherSpecialFeeModalForm = ({
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
      formFieldProps: { lg: 6 },
      inputProps: { required: true },
      selectProps: {
        options: teacherData,
        getOptionLabel: (option) => getFullNameFromTeacher(option)
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "course",
      label: "Course",
      formFieldProps: { lg: 6, sx: { pt: { xs: "8px !important", sm: "24px !important" } } }, // on "xs", this field is no longer the top-most row, so we need to use the same "pt" as other fields.
      inputProps: { required: true },
      selectProps: {
        options: courseData,
        getOptionLabel: (option) => getCourseName(option)
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "fee",
      label: "Fee",
      formFieldProps: { lg: 6, sx: { pt: "8px !important" } },
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

  const { formProperties: updateFormProperties, formRenderer: updateFormRenderer } =
    useFormRenderer<TeacherSpecialFeeUpdateFormData>(
      {
        testIdContext: "TeacherSpecialFeeUpsert",
        cancelButtonProps: {
          onClick: onClose
        },
        fields: defaultUpdateFields,
        submitHandler: async ({ fee }, error) => {
          if (error.fee) return Promise.reject();
          const response = await ADMIN_API.UpdateTeacherSpecialFee([
            { teacherSpecialFeeId: selectedData?.teacherSpecialFeeId || 0, fee }
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
    );

  const { formRenderer: insertFormRenderer } = useFormRenderer<TeacherSpecialFeeInsertFormData>(
    {
      testIdContext: "TeacherSpecialFeeUpsert",
      cancelButtonProps: {
        onClick: onClose
      },
      fields: defaultInsertFields,
      errorResponseMapping,
      submitHandler: async ({ fee, teacher, course }, error) => {
        if (error.fee || error.teacher || error.course) return Promise.reject();
        const response = await ADMIN_API.InsertTeacherSpecialFee([
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
      updateFormProperties.valueRef.current = {
        fee: selectedData.fee
      };
      updateFormProperties.errorRef.current = {} as Record<
        keyof TeacherSpecialFeeUpdateFormData,
        string
      >;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Teacher Special Fee
      </Typography>
      {selectedData ? updateFormRenderer() : insertFormRenderer()}
    </Modal>
  );
};

export default PageAdminTeacherSpecialFeeModalForm;
