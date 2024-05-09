import { Box, Button, Link, Typography } from "@mui/material";
import TeacherPaymentItem from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentItem/TeacherPaymentItem";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { TeacherPaymentInvoiceItemStudent } from "@sonamusica-fe/types";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

export interface TeacherPaymentItemContainerProps {
  classId: number;
  data: TeacherPaymentInvoiceItemStudent;
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
}

const TeacherPaymentItemContainer = React.memo(
  ({
    data,
    classId,
    handleSubmitDataChange
  }: TeacherPaymentItemContainerProps): React.ReactElement => {
    const { push } = useRouter();
    const { showDialog } = useAlertDialog();
    const onAttendanceDetailClick = useCallback(() => {
      showDialog(
        {
          title: "Going to student's attendance detail...",
          content: "All changes in this page will be lost. Proceed?"
        },
        () => {
          push({
            pathname: "/attendance/" + classId,
            query: { studentId: data.studentId }
          });
        }
      );
    }, []);

    return (
      <>
        <Typography component="span" variant="subtitle1">
          {getFullNameFromUser(data.user)}
        </Typography>
        <Button size="small" onClick={onAttendanceDetailClick} variant="text">
          <small>View Detail</small>
        </Button>
        <Box>
          {data.studentLearningTokens.map((val) => (
            <TeacherPaymentItem
              key={val.studentLearningTokenId}
              data={val}
              handleSubmitDataChange={handleSubmitDataChange}
            />
          ))}
        </Box>
      </>
    );
  }
);

export default TeacherPaymentItemContainer;
