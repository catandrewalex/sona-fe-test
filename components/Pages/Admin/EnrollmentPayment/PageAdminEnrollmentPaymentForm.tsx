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
import moment from "moment";
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
      formFieldProps: { lg: 3, md: 6 },
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
      formFieldProps: { lg: 3, md: 6 },
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
      formFieldProps: { lg: 3, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
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
      formFieldProps: { lg: 3, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
      inputProps: {
        type: "number"
      },
      validations: []
    }
  ];

  const defaultUpdateFields: FormFieldType<EnrollmentPaymentUpdateFormData>[] =
    defaultInsertFields.slice(1) as FormFieldType<EnrollmentPaymentUpdateFormData>[];

  defaultUpdateFields.push({
    type: "date",
    name: "paymentDate",
    label: "Payment Date",
    formFieldProps: { lg: 3, md: 6, sx: selectedData ? {} : { pt: "8px !important" } },
    validations: [{ name: "required" }]
  });

  const defaultInsertFieldValue: EnrollmentPaymentInsertFormData = {
    balanceTopUp: 0,
    courseFeeValue: 0,
    transportFeeValue: 0,
    valuePenalty: 0,
    studentEnrollment: null
  };
  const defaultUpdateFieldValue: EnrollmentPaymentUpdateFormData = {
    balanceTopUp: 0,
    courseFeeValue: 0,
    transportFeeValue: 0,
    valuePenalty: 0,
    paymentDate: moment().format()
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
          submitHandler: async (
            { courseFeeValue, balanceTopUp, transportFeeValue, paymentDate, valuePenalty },
            error
          ) => {
            if (
              error.courseFeeValue ||
              error.balanceTopUp ||
              error.transportFeeValue ||
              error.valuePenalty ||
              error.paymentDate
            )
              return Promise.reject();
            const response = await API.UpdateEnrollmentPayment([
              {
                valuePenalty,
                balanceTopUp,
                courseFeeValue,
                transportFeeValue,
                paymentDate,
                enrollmentPaymentId: selectedData.enrollmentPaymentId
              }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<EnrollmentPayment>).results[0];
              const newData = data.map((val) => {
                if (val.enrollmentPaymentId === responseData.enrollmentPaymentId) {
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
            { courseFeeValue, balanceTopUp, studentEnrollment, transportFeeValue, valuePenalty },
            error
          ) => {
            if (
              error.courseFeeValue ||
              error.balanceTopUp ||
              error.transportFeeValue ||
              error.studentEnrollment ||
              error.valuePenalty
            )
              return Promise.reject();
            const response = await API.InsertEnrollmentPayment([
              {
                courseFeeValue,
                transportFeeValue,
                balanceTopUp,
                valuePenalty,
                paymentDate: moment().format(),
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
        defaultInsertFieldValue
      );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        balanceTopUp: selectedData.balanceTopUp,
        transportFeeValue: selectedData.transportFeeValue,
        courseFeeValue: selectedData.courseFeeValue,
        paymentDate: selectedData.paymentDate,
        valuePenalty: selectedData.valuePenalty
      };
      formProperties.errorRef.current = {} as Record<keyof EnrollmentPaymentUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Enrollment Payment
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminEnrollmentPaymentForm;
