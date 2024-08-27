import { Box, Divider, Table, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { EnrollmentPaymentInvoice, StudentEnrollment } from "@sonamusica-fe/types";
import {
  convertMomentDateToRFC3339,
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";

type NewPaymentStepThreeProps = {
  studentEnrollmentData?: StudentEnrollment;
  invoiceData?: EnrollmentPaymentInvoice;
};

const CellNoBorder = styled(TableCell)({
  borderBottom: "none"
});

const NewPaymentStepThree = ({
  studentEnrollmentData,
  invoiceData
}: NewPaymentStepThreeProps): JSX.Element => {
  const courseFeeValue = invoiceData?.courseFeeValue || 0;
  const transportFeeValue = invoiceData?.transportFeeValue || 0;
  const penaltyFeeValue = invoiceData?.penaltyFeeValue || 0;
  const paymentDate = invoiceData?.paymentDate || "";

  return (
    <Box width="100%" margin="auto" p={2}>
      <Typography variant="body1">Student Name:</Typography>
      <Typography variant="body2" fontWeight="bold">
        {getFullNameFromStudent(studentEnrollmentData?.student)}
      </Typography>
      <Typography sx={{ mt: 1 }} variant="body1">
        Course:
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {getCourseName(studentEnrollmentData?.class.course)}
      </Typography>
      <Typography sx={{ mt: 1 }} variant="body1">
        Teacher:
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {getFullNameFromTeacher(studentEnrollmentData?.class?.teacher)}
      </Typography>
      <Divider sx={{ borderWidth: "3px", my: 3 }} />
      <Table
        size="small"
        sx={{
          "& .MuiTableCell-root:first-child": {
            pr: 0
          },
          "& .MuiTableCell-root:last-child": {
            pl: 0
          },
          "& .MuiTableCell-root:not(:last-child):not(:first-child)": {
            px: 1
          }
        }}
      >
        <TableRow>
          <CellNoBorder>Course Fee</CellNoBorder>
          <CellNoBorder></CellNoBorder>
          <CellNoBorder sx={{ textAlign: "right" }}>
            {convertNumberToCurrencyString(courseFeeValue)}
          </CellNoBorder>
        </TableRow>
        <TableRow>
          <CellNoBorder>Transport Fee</CellNoBorder>
          <CellNoBorder></CellNoBorder>
          <CellNoBorder sx={{ textAlign: "right" }}>
            {convertNumberToCurrencyString(transportFeeValue)}
          </CellNoBorder>
        </TableRow>
        <TableRow>
          <CellNoBorder>Penalty</CellNoBorder>
          <CellNoBorder></CellNoBorder>
          <CellNoBorder sx={{ textAlign: "right" }}>
            {convertNumberToCurrencyString(penaltyFeeValue)}
          </CellNoBorder>
        </TableRow>
        <TableRow>
          <CellNoBorder>Payment Date</CellNoBorder>
          <CellNoBorder></CellNoBorder>
          <CellNoBorder sx={{ textAlign: "right" }}>
            {moment(paymentDate).format("DD MMMM YYYY")}
          </CellNoBorder>
        </TableRow>
      </Table>
      <Divider sx={{ borderWidth: "3px", my: 3 }} />
      <Typography variant="h6" textAlign="right">
        Total Payment:{" "}
        {convertNumberToCurrencyString(courseFeeValue + transportFeeValue + penaltyFeeValue)}
      </Typography>
    </Box>
  );
};

export default NewPaymentStepThree;
