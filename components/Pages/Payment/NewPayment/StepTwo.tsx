import { Box } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import StandardDatePicker from "@sonamusica-fe/components/Form/StandardDatePicker";
import StandardTextInput from "@sonamusica-fe/components/Form/StandardTextInput";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import FormDataViewerTable, {
  FormDataViewerTableConfig
} from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Class, EnrollmentPaymentInvoice, Student, StudentEnrollment } from "@sonamusica-fe/types";
import {
  convertMomentDateToRFC3339,
  convertNumberToCurrencyString,
  convertNumberToCurrencyStringWithoutPrefixAndSuffix,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  removeNonNumericCharacter
} from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";

type NewPaymentStepTwoProps = {
  studentEnrollmentData?: StudentEnrollment;
  invoiceData?: EnrollmentPaymentInvoice;
  setInvoiceData: (data: EnrollmentPaymentInvoice) => void;
  setRecalculateInvoice: (value: boolean) => void;
  recalculateInvoiceData: boolean;
};

const NewPaymentStepTwo = ({
  studentEnrollmentData,
  setInvoiceData,
  invoiceData,
  setRecalculateInvoice,
  recalculateInvoiceData
}: NewPaymentStepTwoProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);

  const { showSnackbar } = useSnack();
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (studentEnrollmentData && recalculateInvoiceData) {
      API.GetPaymentInvoice(studentEnrollmentData.studentEnrollmentId)
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            const invoiceData: EnrollmentPaymentInvoice =
              parsedResponse as EnrollmentPaymentInvoice;
            setInvoiceData({
              balanceTopUp: invoiceData.balanceTopUp,
              balanceBonus: invoiceData.balanceBonus,
              courseFeeValue: invoiceData.courseFeeValue,
              transportFeeValue: invoiceData.transportFeeValue,
              penaltyFeeValue: invoiceData.penaltyFeeValue,
              lastPaymentDate: invoiceData.lastPaymentDate,
              daysLate: invoiceData.daysLate,
              paymentDate: invoiceData.paymentDate || convertMomentDateToRFC3339(moment())
            });
            setRecalculateInvoice(false);
          } else {
            showSnackbar("Failed to fetch invoice data!", "error");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [studentEnrollmentData]);

  const getStudentDataDisplay = useCallback((data?: Student): FormDataViewerTableConfig[] => {
    if (data) {
      return [
        { title: "Full Name", value: getFullNameFromStudent(data) },
        { title: "Email", value: data.user.email || "-" }
      ];
    }
    return [];
  }, []);

  const getClassDataDisplay = useCallback((data?: Class): FormDataViewerTableConfig[] => {
    if (data) {
      return [
        { title: "Teacher", value: getFullNameFromTeacher(data.teacher) },
        { title: "Course", value: getCourseName(data.course) }
      ];
    }
    return [];
  }, []);

  const getLastPaymentDataDisplay = useCallback(
    (data?: EnrollmentPaymentInvoice): FormDataViewerTableConfig[] => {
      if (data) {
        const date = data.lastPaymentDate ? moment(data.lastPaymentDate) : undefined;
        const daysLate = data.daysLate ?? 0;
        return [
          { title: "Date", value: date ? date.format("DD MMMM YYYY") : "-" },
          { title: "Days Late", value: daysLate > 0 ? daysLate.toString() : "-" }
        ];
      }
      return [];
    },
    []
  );

  const getInvoiceDataDisplay = useCallback((data?: EnrollmentPaymentInvoice) => {
    if (data) {
      return [
        {
          title: "Balance Top Up",
          value: (
            <StandardTextInput
              value={data.balanceTopUp}
              onChange={(e) =>
                setInvoiceData({ ...data, balanceTopUp: parseInt(e.target.value || "0") })
              }
              type="number"
              margin="dense"
              size="small"
            />
          )
        },
        {
          title: "Balance Bonus",
          value: (
            <StandardTextInput
              value={data.balanceBonus}
              onChange={(e) =>
                setInvoiceData({ ...data, balanceBonus: parseInt(e.target.value || "0") })
              }
              type="number"
              margin="dense"
              size="small"
            />
          )
        },
        {
          title: "Course Fee",
          value: (
            <StandardTextInput
              value={convertNumberToCurrencyStringWithoutPrefixAndSuffix(data.courseFeeValue)}
              onChange={(e) =>
                setInvoiceData({
                  ...data,
                  courseFeeValue: parseInt(
                    e.target.value ? removeNonNumericCharacter(e.target.value) : "0"
                  )
                })
              }
              type="text"
              margin="dense"
              size="small"
              startAdornment="Rp"
            />
          )
        },
        {
          title: "Transport Fee",
          value: (
            <StandardTextInput
              value={convertNumberToCurrencyStringWithoutPrefixAndSuffix(data.transportFeeValue)}
              onChange={(e) =>
                setInvoiceData({
                  ...data,
                  transportFeeValue: parseInt(
                    e.target.value ? removeNonNumericCharacter(e.target.value) : "0"
                  )
                })
              }
              type="text"
              margin="dense"
              size="small"
              startAdornment="Rp"
            />
          )
        },
        {
          title: "Penalty Fee",
          value: (
            <StandardTextInput
              value={convertNumberToCurrencyStringWithoutPrefixAndSuffix(data.penaltyFeeValue)}
              onChange={(e) =>
                setInvoiceData({
                  ...data,
                  penaltyFeeValue: parseInt(
                    e.target.value ? removeNonNumericCharacter(e.target.value) : "0"
                  )
                })
              }
              type="text"
              margin="dense"
              size="small"
              startAdornment="Rp"
            />
          )
        },
        {
          title: "Payment Date",
          value: (
            <StandardDatePicker
              format="DD/MM/YYYY"
              defaultValue={moment(invoiceData?.paymentDate)}
              onChange={(e) =>
                setInvoiceData({ ...data, paymentDate: convertMomentDateToRFC3339(e || moment()) })
              }
              closeOnSelect={true}
              slotProps={{ textField: { size: "small", margin: "dense" } }}
              sx={{ width: "100%" }}
            />
          )
        },
        {
          title: "Total Payment",
          value: convertNumberToCurrencyString(
            data.courseFeeValue + data.transportFeeValue + data.penaltyFeeValue
          ),
          sx: { fontWeight: "bold", py: 1.5, fontSize: 20 }
        }
      ];
    }
    return [];
  }, []);

  if (loading) return <LoaderSimple />;

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      <Box mb={2}>
        <FormDataViewerTable
          tableProps={{ size: "small" }}
          dataTitle="Student Data"
          data={getStudentDataDisplay(studentEnrollmentData?.student)}
        />
      </Box>
      <Box mb={2}>
        <FormDataViewerTable
          tableProps={{ size: "small" }}
          dataTitle="Class Data"
          data={getClassDataDisplay(studentEnrollmentData?.class)}
        />
      </Box>
      <Box mb={2}>
        <FormDataViewerTable
          tableProps={{ size: "small" }}
          dataTitle="Last Payment"
          data={getLastPaymentDataDisplay(invoiceData)}
        />
      </Box>
      <Box>
        <FormDataViewerTable
          tableProps={{ size: "small" }}
          dataTitle="Invoice Data"
          data={getInvoiceDataDisplay(invoiceData)}
          tableCellProps={{ sx: { py: 0 } }}
        />
      </Box>
    </Box>
  );
};

export default NewPaymentStepTwo;
