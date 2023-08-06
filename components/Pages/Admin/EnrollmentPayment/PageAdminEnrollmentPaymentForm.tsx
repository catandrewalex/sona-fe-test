import { Cancel, Save } from "@mui/icons-material";
import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { EnrollmentPayment, StudentEnrollment, Course } from "@sonamusica-fe/types";
import {
  EnrollmentPaymentInsertFormData,
  EnrollmentPaymentUpdateFormData
} from "@sonamusica-fe/types/form/enrollment-payment";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminEnrollmentPaymentFormProps = {
  data: EnrollmentPayment[];
  studentEnrollmentData: StudentEnrollment[];
  setData: (newData: EnrollmentPayment[]) => void;
  selectedData: EnrollmentPayment | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  quota: "quota",
  studentEnrollment: "studentEnrollmentId"
};

const PageAdminEnrollmentPaymentForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  studentEnrollmentData
}: PageAdminEnrollmentPaymentFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultInsertFields: FormFieldType<EnrollmentPaymentInsertFormData>[] = [
    {
      type: "select",
      name: "studentEnrollment",
      label: "StudentEnrollment",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: studentEnrollmentData,
        getOptionLabel: (option) =>
          `${option.student.user.userDetail?.firstName} ${
            option.student.user.userDetail?.lastName || ""
          } | ${option.class.course.instrument.name} - ${option.class.course.grade.name}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "courseFeeValue",
      label: "Course Fee",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: {
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: []
    },
    {
      type: "text",
      name: "transportFeeValue",
      label: "Transport Fee",
      formFieldProps: { lg: 6, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
      inputProps: {
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: []
    },
    {
      type: "text",
      name: "valuePenalty",
      label: "Penalty Fee",
      formFieldProps: { lg: 6, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
      inputProps: {
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: []
    },
    {
      type: "text",
      name: "balanceTopUp",
      label: "Balance Top Up",
      formFieldProps: { lg: 6, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
      inputProps: {
        type: "number"
      },
      validations: []
    },
    {
      type: "text",
      name: "quota",
      label: "Quota",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number"
      },
      validations: [{ name: "required" }]
    }
  ];

  const defaultUpdateFields: FormFieldType<EnrollmentPaymentUpdateFormData>[] =
    defaultInsertFields.slice(1) as FormFieldType<EnrollmentPaymentUpdateFormData>[];

  const defaultFieldValue: Omit<
    EnrollmentPaymentInsertFormData,
    "studentEnrollment" | "lastUpdatedAt"
  > = {
    quota: 0,
    courseFeeValue: 0,
    transportFeeValue: 0
  };

  const { formProperties, formRenderer } = selectedData
    ? useFormRenderer<EnrollmentPaymentUpdateFormData>(
        {
          testIdContext: "EnrollmentPaymentUpsert",
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save /> },
          fields: defaultUpdateFields,
          submitHandler: async ({ courseFeeValue, quota, transportFeeValue }, error) => {
            if (error.courseFeeValue || error.quota || error.transportFeeValue)
              return Promise.reject();
            const response = await API.UpdateEnrollmentPayment([
              {
                quota,
                courseFeeValue,
                transportFeeValue,
                studentLearningTokenId: selectedData.studentLearningTokenId
              }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<EnrollmentPayment>).results[0];
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
      )
    : useFormRenderer<EnrollmentPaymentInsertFormData>(
        {
          testIdContext: "EnrollmentPaymentUpsert",
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save /> },
          fields: defaultInsertFields,
          errorResponseMapping,
          submitHandler: async (
            { courseFeeValue, quota, studentEnrollment, transportFeeValue },
            error
          ) => {
            if (
              error.courseFeeValue ||
              error.quota ||
              error.transportFeeValue ||
              error.studentEnrollment
            )
              return Promise.reject();
            const response = await API.InsertEnrollmentPayment([
              {
                courseFeeValue,
                transportFeeValue,
                quota,
                studentEnrollmentId: studentEnrollment?.studentEnrollmentId || 0
              }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<EnrollmentPayment>).results[0];
              setData([...data, responseData]);
            }
          }
        },
        { ...defaultFieldValue, studentEnrollment: null }
      );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        quota: selectedData.quota,
        transportFeeValue: selectedData.transportFeeValue,
        courseFeeValue: selectedData.courseFeeValue
      };
      formProperties.errorRef.current = {} as Record<keyof EnrollmentPaymentUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Student Learning Token
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminEnrollmentPaymentForm;
