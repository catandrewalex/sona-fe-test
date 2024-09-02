import { InputAdornment, Typography } from "@mui/material";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { EnrollmentPayment, StudentEnrollment } from "@sonamusica-fe/types";
import {
  EnrollmentPaymentInsertFormData,
  EnrollmentPaymentUpdateFormData
} from "@sonamusica-fe/types/form/admin/enrollment-payment";
import {
  convertMomentDateToRFC3339,
  getCourseName,
  getFullNameFromStudent
} from "@sonamusica-fe/utils/StringUtil";
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
  studentEnrollment: "studentEnrollmentId",
  balanceTopUp: "balanceTopUp"
};

const PageAdminEnrollmentPaymentModalForm = ({
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
      label: "Student Enrollment",
      formFieldProps: { lg: 12, md: 12, sm: 12, xs: 12 },
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
      name: "balanceTopUp",
      label: "Balance Top Up",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "balanceBonus",
      label: "Balance Bonus",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "courseFeeValue",
      label: "Course Fee",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "transportFeeValue",
      label: "Transport Fee",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "penaltyFeeValue",
      label: "Penalty Fee",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "discountFeeValue",
      label: "Discount Fee",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "date",
      name: "paymentDate",
      label: "Payment Date",
      formFieldProps: { lg: 4, sx: { pt: "8px !important" } },
      validations: [],
      dateProps: { defaultValue: moment(), slotProps: { textField: { required: true } } }
    }
  ];

  const defaultUpdateFields: FormFieldType<EnrollmentPaymentUpdateFormData>[] =
    defaultInsertFields.slice(
      1,
      defaultInsertFields.length - 1
    ) as FormFieldType<EnrollmentPaymentUpdateFormData>[];

  defaultUpdateFields.push({
    type: "date",
    name: "paymentDate",
    label: "Payment Date",
    formFieldProps: { lg: 4, sx: selectedData ? {} : { pt: "8px !important" } },
    validations: [],
    dateProps: { slotProps: { textField: { required: true } } }
  });

  const defaultUpdateFieldValue: EnrollmentPaymentUpdateFormData = {
    balanceTopUp: 0,
    balanceBonus: 0,
    courseFeeValue: 0,
    transportFeeValue: 0,
    penaltyFeeValue: 0,
    discountFeeValue: 0,
    paymentDate: moment()
  };

  const defaultInsertFieldValue: EnrollmentPaymentInsertFormData = {
    ...defaultUpdateFieldValue,
    studentEnrollment: null
  };

  const { formProperties: updateFormProperties, formRenderer: updateFormRenderer } =
    useFormRenderer<EnrollmentPaymentUpdateFormData>(
      {
        testIdContext: "EnrollmentPaymentUpsert",
        cancelButtonProps: {
          onClick: onClose
        },
        fields: defaultUpdateFields,
        submitHandler: async (
          {
            courseFeeValue,
            balanceTopUp,
            balanceBonus,
            transportFeeValue,
            penaltyFeeValue,
            discountFeeValue,
            paymentDate
          },
          error
        ) => {
          if (
            error.courseFeeValue ||
            error.balanceTopUp ||
            error.transportFeeValue ||
            error.penaltyFeeValue ||
            error.paymentDate
          )
            return Promise.reject();
          const response = await ADMIN_API.UpdateEnrollmentPayment([
            {
              penaltyFeeValue,
              balanceTopUp,
              balanceBonus,
              courseFeeValue,
              transportFeeValue,
              discountFeeValue,
              paymentDate: convertMomentDateToRFC3339(paymentDate),
              enrollmentPaymentId: selectedData?.enrollmentPaymentId || 0
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
    );

  const { formRenderer: insertFormRenderer } = useFormRenderer<EnrollmentPaymentInsertFormData>(
    {
      testIdContext: "EnrollmentPaymentUpsert",
      cancelButtonProps: {
        onClick: onClose
      },
      fields: defaultInsertFields,
      errorResponseMapping,
      submitHandler: async (
        {
          courseFeeValue,
          balanceTopUp,
          balanceBonus,
          studentEnrollment,
          transportFeeValue,
          penaltyFeeValue,
          discountFeeValue,
          paymentDate
        },
        error
      ) => {
        if (
          error.courseFeeValue ||
          error.balanceTopUp ||
          error.transportFeeValue ||
          error.studentEnrollment ||
          error.penaltyFeeValue
        )
          return Promise.reject();
        const response = await ADMIN_API.InsertEnrollmentPayment([
          {
            courseFeeValue,
            transportFeeValue,
            balanceTopUp,
            balanceBonus,
            penaltyFeeValue,
            discountFeeValue,
            paymentDate: convertMomentDateToRFC3339(paymentDate),
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
      updateFormProperties.valueRef.current = {
        balanceTopUp: selectedData.balanceTopUp,
        balanceBonus: selectedData.balanceBonus,
        transportFeeValue: selectedData.transportFeeValue,
        courseFeeValue: selectedData.courseFeeValue,
        penaltyFeeValue: selectedData.penaltyFeeValue,
        discountFeeValue: selectedData.discountFeeValue,
        paymentDate: moment(selectedData.paymentDate)
      };
      updateFormProperties.errorRef.current = {} as Record<
        keyof EnrollmentPaymentUpdateFormData,
        string
      >;
    }
  }, [selectedData, updateFormProperties.errorRef, updateFormProperties.valueRef]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Enrollment Payment
      </Typography>
      {selectedData ? updateFormRenderer() : insertFormRenderer()}
    </Modal>
  );
};

export default PageAdminEnrollmentPaymentModalForm;
