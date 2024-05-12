import { Table, TableBody, TableRow, TableCell } from "@mui/material";
import { styled } from "@mui/system";
import { Class } from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  getFullNameFromStudent
} from "@sonamusica-fe/utils/StringUtil";

const CellTitle = styled(TableCell)({
  width: "30%"
});

const CellSemiColon = styled(TableCell)({
  align: "center"
});

const AttendanceResultDetail = (data: Class): JSX.Element => {
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
          <CellTitle width="30%">Fee</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>
            {convertNumberToCurrencyString(data.teacherSpecialFee ?? data.course.defaultFee)}
          </TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Transport Fee</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{convertNumberToCurrencyString(data.transportFee)}</TableCell>
        </TableRow>
        <TableRow>
          <CellTitle width="30%">Duration</CellTitle>
          <CellSemiColon align="center">:</CellSemiColon>
          <TableCell>{data.course.defaultDurationMinute} minutes</TableCell>
        </TableRow>
        {data.students.length === 0 ? (
          <TableRow>
            <CellTitle width="30%">Students</CellTitle>
            <CellSemiColon align="center">:</CellSemiColon>
            <TableCell>-</TableCell>
          </TableRow>
        ) : (
          data.students.map((student, idx) => (
            <TableRow key={student.studentId + student.user.username}>
              <CellTitle width="30%">{idx === 0 ? "Students" : ""}</CellTitle>
              <CellSemiColon align="center">{idx === 0 ? ":" : ""}</CellSemiColon>
              <TableCell>{getFullNameFromStudent(student)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AttendanceResultDetail;
