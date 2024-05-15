import { Box, Button, Typography } from "@mui/material";
import TeacherPaymentItem from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentItem/TeacherPaymentItem";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { TeacherPaymentInvoiceItemStudent } from "@sonamusica-fe/types";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

export interface TeacherPaymentItemContainerProps {
  isEdit?: boolean;
  classId: number;
  data: TeacherPaymentInvoiceItemStudent;
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
  handleDeleteData?: (teacherPaymentId: number, value: boolean) => void;
}

const TeacherPaymentItemContainer = React.memo(
  ({
    isEdit,
    classId,
    data,
    handleSubmitDataChange,
    handleDeleteData
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
    }, [classId, data.studentId, push, showDialog]);

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
              isEdit={isEdit}
              key={val.studentLearningTokenId}
              data={val}
              handleSubmitDataChange={handleSubmitDataChange}
              handleDeleteData={handleDeleteData}
            />
          ))}
        </Box>
      </>
    );
  }
);

export default TeacherPaymentItemContainer;
