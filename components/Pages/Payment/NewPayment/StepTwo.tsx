import { Box, Grid, InputAdornment } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import StandardTextInput from "@sonamusica-fe/components/Form/StandardTextInput";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import FormDataViewerTable, {
  FormDataViewerTableConfig
} from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import {
  Class,
  EnrollmentPayment,
  EnrollmentPaymentInvoice,
  Student,
  StudentEnrollment
} from "@sonamusica-fe/types";
import {
  convertMomentDateToRFC3339,
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";

type NewPaymentStepTwoProps = {
  studentEnrollmentData?: StudentEnrollment;
  invoiceData?: EnrollmentPaymentInvoice;
  setInvoiceData: (data: EnrollmentPaymentInvoice) => void;
};

const NewPaymentStepTwo = ({
  studentEnrollmentData,
  setInvoiceData,
  invoiceData
}: NewPaymentStepTwoProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);

  const { showSnackbar } = useSnack();
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (studentEnrollmentData && !invoiceData) {
      API.GetPaymentInvoice(studentEnrollmentData.studentEnrollmentId)
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            const invoiceData: EnrollmentPaymentInvoice =
              parsedResponse as EnrollmentPaymentInvoice;
            setInvoiceData({
              balanceTopUp: invoiceData.balanceTopUp,
              courseFeeValue: invoiceData.courseFeeValue,
              transportFeeValue: invoiceData.transportFeeValue,
              valuePenalty: invoiceData.valuePenalty
            });
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

  const getInvoiceDataDisplay = useCallback((data?: EnrollmentPaymentInvoice) => {
    if (data) {
      return [
        {
          title: "Topup Balance",
          value: (
            <StandardTextInput
              value={data.balanceTopUp}
              onChange={(e) =>
                setInvoiceData({ ...data, balanceTopUp: parseInt(e.target.value || "1") })
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
              value={data.courseFeeValue}
              onChange={(e) =>
                setInvoiceData({ ...data, courseFeeValue: parseInt(e.target.value || "0") })
              }
              type="number"
              margin="dense"
              size="small"
              helperText={"Currency Fomat: " + convertNumberToCurrencyString(data.courseFeeValue)}
            />
          )
        },
        {
          title: "Transport Fee",
          value: (
            <StandardTextInput
              value={data.transportFeeValue}
              onChange={(e) =>
                setInvoiceData({ ...data, transportFeeValue: parseInt(e.target.value || "0") })
              }
              type="number"
              margin="dense"
              size="small"
              helperText={
                "Currency Fomat: " + convertNumberToCurrencyString(data.transportFeeValue)
              }
            />
          )
        },
        {
          title: "Penalty Fee",
          value: (
            <StandardTextInput
              value={data.valuePenalty}
              onChange={(e) =>
                setInvoiceData({ ...data, valuePenalty: parseInt(e.target.value || "0") })
              }
              type="number"
              margin="dense"
              size="small"
              helperText={"Currency Fomat: " + convertNumberToCurrencyString(data.valuePenalty)}
            />
          )
        },
        {
          title: "Total Payment",
          value: convertNumberToCurrencyString(
            data.balanceTopUp * data.courseFeeValue + data.transportFeeValue + data.valuePenalty
          ),
          sx: { fontWeight: "bold", py: 1.5, fontSize: 20 }
        }
      ];
    }
    return [];
  }, []);
  console.log(invoiceData);
  if (loading) return <LoaderSimple />;

  return (
    <Box sx={{ width: "100%" }}>
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
