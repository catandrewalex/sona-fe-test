import { Accordion, AccordionSummary, Box, Typography } from "@mui/material";
import {
  TeacherPaymentInvoiceItemAttendanceModify,
  TeacherPaymentInvoiceItemModify,
  TeacherPaymentInvoiceItemStudentLearningToken,
  TeacherPaymentInvoiceItemSubmit
} from "@sonamusica-fe/types";
import React, { useCallback, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { convertNumberToCurrencyString } from "@sonamusica-fe/utils/StringUtil";
import TeacherPaymentItemDetails from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentItem/TeacherPaymentItemDetails";

interface TeacherPaymentItemProps {
  data: TeacherPaymentInvoiceItemStudentLearningToken;
  isEdit?: boolean;
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
  handleDeleteData?: (teacherPaymentId: number, value: boolean) => void;
}

const TeacherPaymentItem = React.memo(
  ({
    isEdit,
    data,
    handleSubmitDataChange,
    handleDeleteData
  }: TeacherPaymentItemProps): JSX.Element => {
    const [internalSubmitData, setInternalSubmitData] = useState<
      Record<string, TeacherPaymentInvoiceItemSubmit | TeacherPaymentInvoiceItemModify>
    >({});

    const calculateTotalFromAttendances = Object.values(internalSubmitData).reduce(
      (prev, curr) =>
        isEdit && (curr as TeacherPaymentInvoiceItemModify).isDeleted
          ? prev
          : prev + curr.paidCourseFeeValue + curr.paidTransportFeeValue,
      0
    );
    const calculateTotalGross = () => {
      return Object.values(internalSubmitData).reduce(
        (prev, curr) =>
          isEdit && (curr as TeacherPaymentInvoiceItemModify).isDeleted
            ? prev
            : prev +
              (curr as TeacherPaymentInvoiceItemModify).grossCourseFeeValue +
              (curr as TeacherPaymentInvoiceItemModify).grossTransportFeeValue,
        0
      );
    };

    const calculateTotalUsedQuotaFromAttendances = useCallback(() => {
      return Object.values(data.attendances).reduce(
        (prev, curr) => prev + curr.usedStudentTokenQuota,
        0
      );
    }, [data.attendances]);

    useEffect(() => {
      const tempSubmitData: Record<
        string,
        TeacherPaymentInvoiceItemSubmit | TeacherPaymentInvoiceItemModify
      > = {};
      for (const attendance of data.attendances) {
        if (isEdit) {
          tempSubmitData[
            (attendance as TeacherPaymentInvoiceItemAttendanceModify).teacherPaymentId.toString()
          ] = {
            ...tempSubmitData[
              (attendance as TeacherPaymentInvoiceItemAttendanceModify).teacherPaymentId.toString()
            ],
            teacherPaymentId: (attendance as TeacherPaymentInvoiceItemAttendanceModify)
              .teacherPaymentId,
            paidCourseFeeValue:
              (attendance as TeacherPaymentInvoiceItemAttendanceModify).paidCourseFeeValue ?? 0,
            paidTransportFeeValue:
              (attendance as TeacherPaymentInvoiceItemAttendanceModify).paidTransportFeeValue ?? 0,
            grossCourseFeeValue: attendance.grossCourseFeeValue,
            grossTransportFeeValue: attendance.grossTransportFeeValue
          };
        } else {
          tempSubmitData[attendance.attendanceId.toString()] = {
            ...tempSubmitData[attendance.attendanceId.toString()],
            attendanceId: attendance.attendanceId,
            paidCourseFeeValue: Math.round(
              attendance.grossCourseFeeValue * attendance.courseFeeSharingPercentage
            ),
            paidTransportFeeValue: Math.round(
              attendance.grossTransportFeeValue * attendance.transportFeeSharingPercentage
            ),
            grossCourseFeeValue: attendance.grossCourseFeeValue,
            grossTransportFeeValue: attendance.grossTransportFeeValue
          };
        }
      }

      setInternalSubmitData(tempSubmitData);
    }, [data, isEdit]);

    const internalHandleSubmitDataChange = useCallback(
      (attendanceId: number, paidCourseFeeValue: number, paidTransportFeeValue: number) => {
        setInternalSubmitData((prevValue) => {
          const newSubmitData = { ...prevValue };
          newSubmitData[attendanceId.toString()] = {
            ...newSubmitData[attendanceId.toString()],
            attendanceId,
            paidCourseFeeValue,
            paidTransportFeeValue
          };
          return newSubmitData;
        });
        handleSubmitDataChange(attendanceId, paidCourseFeeValue, paidTransportFeeValue);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleSubmitDataChange]
    );

    const internalHandleDeleteData = useCallback(
      (teacherPaymentId: number, value: boolean) => {
        setInternalSubmitData((prevValue) => {
          const newSubmitData = { ...prevValue };
          newSubmitData[teacherPaymentId.toString()] = {
            ...newSubmitData[teacherPaymentId.toString()],
            teacherPaymentId,
            isDeleted: value
          };
          return newSubmitData;
        });
        if (handleDeleteData) handleDeleteData(teacherPaymentId, value);
      },
      [handleDeleteData]
    );

    return (
      <Accordion elevation={0} sx={{ "&:before": { backgroundColor: "transparent" } }}>
        <AccordionSummary
          sx={{
            pr: 0,
            flexDirection: "row-reverse",
            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
              transform: "rotate(90deg)"
            },
            "& .MuiAccordionSummary-content": {
              marginLeft: (theme) => theme.spacing(1)
            },
            "& .MuiAccordionSummary-content.Mui-expanded": {
              marginLeft: (theme) => theme.spacing(1)
            }
          }}
          expandIcon={<ExpandMoreIcon sx={{ fontSize: "0.9rem" }} />}
        >
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", pr: 2 }}>
            <Box>
              <Typography component="span" sx={{ mr: 1 }}>
                Used Quota: {calculateTotalUsedQuotaFromAttendances()}
              </Typography>
              <Typography fontSize={24} component="span" sx={{ mr: 0.5, ml: 0.5 }}>
                |
              </Typography>
              <Typography
                sx={{
                  ml: 1,
                  p: 0.75
                }}
                component="span"
                color={(theme) =>
                  data.quota === 0
                    ? theme.palette.success.main
                    : data.quota === -1 || data.quota === 1
                    ? theme.palette.warning.main
                    : theme.palette.error.main
                }
                fontWeight="bold"
              >
                Remaining Quota: {data.quota}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize="12px" align="right" variant="subtitle1" sx={{ width: "225px" }}>
                ({convertNumberToCurrencyString(calculateTotalGross())})
              </Typography>
              <Typography
                align="right"
                sx={{ width: "225px", textDecoration: "underline" }}
                fontWeight="bold"
              >
                {convertNumberToCurrencyString(calculateTotalFromAttendances)}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <TeacherPaymentItemDetails
          data={data.attendances}
          isEdit={isEdit}
          handleSubmitDataChange={internalHandleSubmitDataChange}
          handleDeleteData={internalHandleDeleteData}
        />
      </Accordion>
    );
  }
);

export default TeacherPaymentItem;
