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

// TODO: fix: when we're on this page, the navigation bar (Teacher Payment tab) is not highlighted
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
            {/* TODO: display remaining quota */}
            <Typography>Used Quota: {calculateTotalUsedQuotaFromAttendances()}</Typography>
            <Typography align="center" sx={{ width: "200px" }}>
              {convertNumberToCurrencyString(calculateTotalFromAttendances)}
            </Typography>
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
