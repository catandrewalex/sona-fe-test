import { Box, Accordion, AccordionSummary, Typography } from "@mui/material";
import {
  TeacherPaymentInvoiceItemStudentLearningToken,
  TeacherPaymentInvoiceItemSubmit
} from "@sonamusica-fe/types";
import React, { useCallback, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { convertNumberToCurrencyString } from "@sonamusica-fe/utils/StringUtil";
import TeacherPaymentItemDetails from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentItem/TeacherPaymentItemDetails";

interface TeacherPaymentItemProps {
  data: TeacherPaymentInvoiceItemStudentLearningToken;
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
}

const TeacherPaymentItem = React.memo(
  ({ data, handleSubmitDataChange }: TeacherPaymentItemProps): JSX.Element => {
    const [internalSubmitData, setInternalSubmitData] = useState<
      Record<string, TeacherPaymentInvoiceItemSubmit>
    >({});

    const calculateTotalFromAttendances = Object.values(internalSubmitData).reduce(
      (prev, curr) => prev + curr.paidCourseFeeValue + curr.paidTransportFeeValue,
      0
    );

    const calculateTotalUsedQuotaFromAttendances = useCallback(() => {
      return Object.values(data.attendances).reduce(
        (prev, curr) => prev + curr.usedStudentTokenQuota,
        0
      );
    }, [data.attendances]);

    useEffect(() => {
      const tempSubmitData: Record<string, TeacherPaymentInvoiceItemSubmit> = {};
      for (const attendance of data.attendances) {
        tempSubmitData[attendance.attendanceId.toString()] = {
          attendanceId: attendance.attendanceId,
          paidCourseFeeValue:
            attendance.grossCourseFeeValue * attendance.courseFeeSharingPercentage,
          paidTransportFeeValue:
            attendance.grossTransportFeeValue * attendance.transportFeeSharingPercentage
        };
      }

      setInternalSubmitData(tempSubmitData);
    }, [data]);

    const internalHandleSubmitDataChange = useCallback(
      (attendanceId: number, paidCourseFeeValue: number, paidTransportFeeValue: number) => {
        setInternalSubmitData((prevValue) => {
          const newSubmitData = { ...prevValue };
          newSubmitData[attendanceId.toString()] = {
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

    return (
      <Accordion
        elevation={0}
        TransitionProps={{ unmountOnExit: true }}
        sx={{ "&:before": { backgroundColor: "transparent" } }}
      >
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
                  p: 0.75,
                  backgroundColor: (theme) =>
                    data.quota === 0
                      ? theme.palette.success.main
                      : data.quota === -1 || data.quota === 1
                      ? theme.palette.warning.main
                      : theme.palette.error.main
                }}
                component="span"
                color={(theme) =>
                  theme.palette.getContrastText(
                    data.quota === 0
                      ? theme.palette.success.main
                      : data.quota === -1 || data.quota === 1
                      ? theme.palette.warning.main
                      : theme.palette.error.main
                  )
                }
              >
                Remaining Quota: {data.quota}
              </Typography>
            </Box>
            <Typography align="center" sx={{ width: "200px" }}>
              {convertNumberToCurrencyString(calculateTotalFromAttendances)}
            </Typography>
            {/* TODO: add SLT's gross value (total course fee & total transport fee) */}
          </Box>
        </AccordionSummary>
        <TeacherPaymentItemDetails
          data={data.attendances}
          handleSubmitDataChange={internalHandleSubmitDataChange}
        />
      </Accordion>
    );
  }
);

export default TeacherPaymentItem;
