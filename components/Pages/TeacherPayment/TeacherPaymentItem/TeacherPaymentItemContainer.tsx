import { Box, Typography } from "@mui/material";
import TeacherPaymentItem from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentItem/TeacherPaymentItem";
import { TeacherPaymentInvoiceItemStudent } from "@sonamusica-fe/types";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import React from "react";

export interface TeacherPaymentItemContainerProps {
  data: TeacherPaymentInvoiceItemStudent;
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
}

const TeacherPaymentItemContainer = React.memo(
  ({ data, handleSubmitDataChange }: TeacherPaymentItemContainerProps): React.ReactElement => {
    return (
      <>
        <Typography variant="subtitle1">{getFullNameFromUser(data.user)}</Typography>
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
