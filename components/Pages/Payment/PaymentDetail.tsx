import { Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";

const CellTitle = styled(TableCell)({
  width: "30%"
});

const CellSemiColon = styled(TableCell)({
  align: "center"
});

const PaymentDetail = (data: EnrollmentPayment): JSX.Element => {
  return (
    <Table
      size="small"
      sx={{
        "& .MuiTableRow-root:last-child": {
          "& .MuiTableCell-root": { borderBottom: "none" }
        },
        "& .MuiTableCell-root:first-child": {
          px: 0
        },
        "& .MuiTableCell-root:last-child": {
          px: 0
        },
        "& .MuiTableCell-root:not(:last-child):not(:first-child)": {
          px: 1
        }
      }}
    >
      <TableBody>
        <TableRow>
          <CellTitle width="30%">Balance Top Up</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{data.balanceTopUp}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Balance Bonus</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{data.balanceBonus != 0 ? data.balanceBonus : "-"}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Fee</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{convertNumberToCurrencyString(data.courseFeeValue)}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Transport Fee</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{convertNumberToCurrencyString(data.transportFeeValue)}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Penalty</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{convertNumberToCurrencyString(data.penaltyFeeValue)}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Discount</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{convertNumberToCurrencyString(data.discountFeeValue)}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Teacher</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{getFullNameFromTeacher(data.studentEnrollment.class.teacher)}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">
            <Typography fontWeight="bold">TOTAL</Typography>
          </CellTitle>
          <CellSemiColon align="center">
            <Typography fontWeight="bold">:</Typography>
          </CellSemiColon>
          <TableCell>
            <Typography fontWeight="bold">
              {convertNumberToCurrencyString(
                data.courseFeeValue +
                  data.transportFeeValue +
                  data.penaltyFeeValue -
                  data.discountFeeValue
              )}
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PaymentDetail;
