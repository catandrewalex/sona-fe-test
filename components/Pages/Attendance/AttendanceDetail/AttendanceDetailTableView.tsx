import { Table, TableBody, TableCell, TableHead, TableRow, tableCellClasses } from "@mui/material";
import { styled } from "@mui/system";
import { Attendance } from "@sonamusica-fe/types";
import { getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";

type AttendanceDetailTableViewProps = {
  currPage: number;
  teacherId: number;
  data: Attendance[];
};

const RESULT_PER_PAGE = 12;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center"
  }
}));

const AttendanceDetailTableView = ({
  data,
  currPage,
  teacherId
}: AttendanceDetailTableViewProps): JSX.Element => {
  return (
    <Table sx={{ "& .MuiTableCell-root": { py: 1.5 } }}>
      <TableHead>
        <TableRow>
          <StyledTableCell sx={{ maxWidth: 50 }}>No.</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 200 }}>Date</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 200 }}>Duration (minutes)</StyledTableCell>
          <StyledTableCell>Notes</StyledTableCell>
          <StyledTableCell>Teacher Substitute</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, idx) => (
          <TableRow hover key={item.attendanceId}>
            <StyledTableCell sx={{ textAlign: "center", maxWidth: 50 }}>
              {(currPage - 1) * RESULT_PER_PAGE + (idx + 1)}
            </StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center", maxWidth: 200 }}>
              {moment(item.date).format("DD MMMM YYYY HH:mm:ss")}
            </StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center", maxWidth: 200 }}>
              {item.duration}
            </StyledTableCell>
            <StyledTableCell>{item.note}</StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center" }}>
              {item.teacher.teacherId !== teacherId ? getFullNameFromTeacher(item.teacher) : "-"}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceDetailTableView;