import { InputAdornment, Typography } from "@mui/material";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { StudentLearningToken, StudentEnrollment } from "@sonamusica-fe/types";
import {
  StudentLearningTokenInsertFormData,
  StudentLearningTokenUpdateFormData
} from "@sonamusica-fe/types/form/admin/student-learning-token";
import { getCourseName, getFullNameFromStudent } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminStudentLearningTokenFormProps = {
  data: StudentLearningToken[];
  studentEnrollmentData: StudentEnrollment[];
  setData: (newData: StudentLearningToken[]) => void;
  selectedData: StudentLearningToken | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  quota: "quota",
  studentEnrollment: "studentEnrollmentId"
};

const PageAdminStudentLearningTokenModalForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  studentEnrollmentData
}: PageAdminStudentLearningTokenFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultInsertFields: FormFieldType<StudentLearningTokenInsertFormData>[] = [
    {
      type: "select",
      name: "studentEnrollment",
      label: "Student Enrollment",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: studentEnrollmentData,
        getOptionLabel: (option) =>
          `${getFullNameFromStudent(option.student)} | ${getCourseName(option.class.course)}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "courseFeeQuarterValue",
      label: "Course Fee Quarter",
      formFieldProps: { lg: 6, sx: { pt: { xs: "8px !important", sm: "24px !important" } } }, // on "xs", this field is no longer the top-most row, so we need to use the same "pt" as other fields.
      inputProps: {
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
        helperText:
          "Note that this is a QUARTER value. The inputted value will be multiplied by 4.",
        required: true
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "transportFeeQuarterValue",
      label: "Transport Fee Quarter",
      formFieldProps: { lg: 6, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
      inputProps: {
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
        helperText:
          "Note that this is a QUARTER value. The inputted value will be multiplied by 4.",
        required: true
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "quota",
      label: "Quota",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }]
    }
  ];

  const defaultUpdateFields: FormFieldType<StudentLearningTokenUpdateFormData>[] =
    defaultInsertFields.slice(1) as FormFieldType<StudentLearningTokenUpdateFormData>[];

  const defaultFieldValue: Omit<
    StudentLearningTokenInsertFormData,
    "studentEnrollment" | "lastUpdatedAt" | "createdAt"
  > = {
    quota: 0,
    courseFeeQuarterValue: 0,
    transportFeeQuarterValue: 0
  };

  const { formProperties: updateFormProperties, formRenderer: updateFormRenderer } =
    useFormRenderer<StudentLearningTokenUpdateFormData>(
      {
        testIdContext: "StudentLearningTokenUpsert",
        cancelButtonProps: {
          onClick: onClose
        },
        fields: defaultUpdateFields,
        submitHandler: async (
          { courseFeeQuarterValue, quota, transportFeeQuarterValue },
          error
        ) => {
          if (error.courseFeeQuarterValue || error.quota || error.transportFeeQuarterValue)
            return Promise.reject();
          const response = await ADMIN_API.UpdateStudentLearningToken([
            {
              quota,
              courseFeeQuarterValue,
              transportFeeQuarterValue,
              studentLearningTokenId: selectedData?.studentLearningTokenId || 0
            }
          ]);
          const parsedResponse = apiTransformer(response, true);
          if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
            return parsedResponse as FailedResponse;
          } else {
            const responseData = (parsedResponse as ResponseMany<StudentLearningToken>).results[0];
            const newData = data.map((val) => {
              if (val.studentLearningTokenId === responseData.studentLearningTokenId) {
                return responseData;
              }
              return val;
            });
            setData(newData);
          }
        }
      },
      defaultFieldValue
    );

  const { formRenderer: insertFormRenderer } = useFormRenderer<StudentLearningTokenInsertFormData>(
    {
      testIdContext: "StudentLearningTokenUpsert",
      cancelButtonProps: {
        onClick: onClose
      },
      fields: defaultInsertFields,
      errorResponseMapping,
      submitHandler: async (
        { courseFeeQuarterValue, quota, studentEnrollment, transportFeeQuarterValue },
        error
      ) => {
        if (
          error.courseFeeQuarterValue ||
          error.quota ||
          error.transportFeeQuarterValue ||
          error.studentEnrollment
        )
          return Promise.reject();
        const response = await ADMIN_API.InsertStudentLearningToken([
          {
            courseFeeQuarterValue,
            transportFeeQuarterValue,
            quota,
            studentEnrollmentId: studentEnrollment?.studentEnrollmentId || 0
          }
        ]);
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<StudentLearningToken>).results[0];
          setData([...data, responseData]);
        }
      }
    },
    { ...defaultFieldValue, studentEnrollment: null }
  );

  useEffect(() => {
    if (selectedData) {
      updateFormProperties.valueRef.current = {
        quota: selectedData.quota,
        // we divide these 2 values, as the name indicates: "..QuarterValue". This is BE's API spec
        transportFeeQuarterValue: selectedData.transportFeeValue / 4,
        courseFeeQuarterValue: selectedData.courseFeeValue / 4
      };
      updateFormProperties.errorRef.current = {} as Record<
        keyof StudentLearningTokenUpdateFormData,
        string
      >;
    }
  }, [selectedData, updateFormProperties.errorRef, updateFormProperties.valueRef]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Student Learning Token
      </Typography>
      {selectedData ? updateFormRenderer() : insertFormRenderer()}
    </Modal>
  );
};

export default PageAdminStudentLearningTokenModalForm;
