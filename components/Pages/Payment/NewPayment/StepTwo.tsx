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
import moment, { Moment } from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  PaymentLastDatePerMonth,
  PaymentLateBaseFeeMultiplierPerDay
} from "@sonamusica-fe/constant/index";

const calculateDaysLate = (paymentDate: Moment, lastPaymentDate: Moment): number => {
  const oneMonthAfterLastPaymentDate = lastPaymentDate.clone().add({ month: 1 });
  const shouldPayDate = moment();
  shouldPayDate.set({
    month: oneMonthAfterLastPaymentDate.month(),
    year: oneMonthAfterLastPaymentDate.year(),
    date: PaymentLastDatePerMonth
  });

  const daysLate = paymentDate.startOf("days").diff(shouldPayDate.startOf("days"), "days");

  return daysLate;
};

const calculatePenalty = (daysLate: number): number => {
  return daysLate * PaymentLateBaseFeeMultiplierPerDay;
};

type NewPaymentStepTwoProps = {
  studentEnrollmentData?: StudentEnrollment;
  invoiceData?: EnrollmentPaymentInvoice;
  setInvoiceData: (data: EnrollmentPaymentInvoice) => void;
  setRecalculateInvoice: (value: boolean) => void;
  recalculateInvoiceData: boolean;
  setHasError: (hasError: boolean) => void;
};

const NewPaymentStepTwo = ({
  studentEnrollmentData,
  setInvoiceData,
  invoiceData,
  setRecalculateInvoice,
  recalculateInvoiceData,
  setHasError
}: NewPaymentStepTwoProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorCourseFee, setErrorCourseFee] = useState<boolean>(false);
  const [errorTransportFee, setErrorTransportFee] = useState<boolean>(false);

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
              discountFeeValue: invoiceData.discountFeeValue,
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

  useEffect(() => {
    if (invoiceData && invoiceData.courseFeeValue % invoiceData.balanceTopUp !== 0) {
      setErrorCourseFee(true);
    } else setErrorCourseFee(false);

    if (invoiceData && invoiceData.transportFeeValue % invoiceData.balanceTopUp !== 0) {
      setErrorTransportFee(true);
    } else setErrorTransportFee(false);
  }, [invoiceData]);

  useEffect(() => {
    if (errorCourseFee || errorTransportFee) setHasError(true);
    else setHasError(false);
  }, [errorCourseFee, errorTransportFee, setHasError]);

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
        const lastPaymentDate = data.lastPaymentDate ? moment(data.lastPaymentDate) : undefined;
        const daysLate = data.daysLate ?? 0;
        return [
          { title: "Date", value: lastPaymentDate ? lastPaymentDate.format("DD MMMM YYYY") : "-" },
          { title: "Days Late", value: daysLate > 0 ? daysLate.toString() : "-" }
        ];
      }
      return [];
    },
    [invoiceData?.paymentDate]
  );

  const getInvoiceDataDisplay = useCallback(
    (data?: EnrollmentPaymentInvoice) => {
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
                errorMsg={errorCourseFee ? "Must be divisible by 'Balance Top Up'" : ""}
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
                errorMsg={errorTransportFee ? "Must be divisible by 'Balance Top Up'" : ""}
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
            title: "Discount Fee",
            value: (
              <StandardTextInput
                value={convertNumberToCurrencyStringWithoutPrefixAndSuffix(data.discountFeeValue)}
                onChange={(e) =>
                  setInvoiceData({
                    ...data,
                    discountFeeValue: parseInt(
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
                defaultValue={data.paymentDate ? moment(data.paymentDate) : moment()}
                onChange={(e) => {
                  const paymentDate = e || moment();
                  const paymentDateStr = convertMomentDateToRFC3339(paymentDate);
                  const lastPaymentDate = moment(data?.lastPaymentDate);

                  const daysLate = calculateDaysLate(paymentDate, lastPaymentDate);
                  const penalty = calculatePenalty(daysLate);

                  setInvoiceData({
                    ...data,
                    paymentDate: paymentDateStr,
                    daysLate: daysLate,
                    penaltyFeeValue: penalty
                  });
                }}
                closeOnSelect={true}
                slotProps={{ textField: { size: "small", margin: "dense" } }}
                sx={{ width: "100%" }}
              />
            )
          },
          {
            title: "Total Payment",
            value: convertNumberToCurrencyString(
              data.courseFeeValue +
                data.transportFeeValue +
                data.penaltyFeeValue -
                data.discountFeeValue
            ),
            sx: { fontWeight: "bold", py: 1.5, fontSize: 20 }
          }
        ];
      }
      return [];
    },
    [errorTransportFee, errorCourseFee]
  );

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
