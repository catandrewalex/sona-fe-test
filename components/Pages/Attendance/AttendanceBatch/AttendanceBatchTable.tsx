import React, { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import moment from "moment";
import {
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { AddAttendanceBatchFormData } from "@sonamusica-fe/types/form/attendance";

interface AttendanceBatchTableProps {
  attendanceBatchFormDataList: AddAttendanceBatchFormData[];
  onRemove: (index: number) => void;
}

export const AttendanceBatchTable = memo(
  ({ attendanceBatchFormDataList, onRemove }: AttendanceBatchTableProps): JSX.Element => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Quota</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceBatchFormDataList.map((attendance, index) => {
              if (!attendance.class || !attendance.teacher) {
                return <></>;
              }

              return (
                <TableRow key={index}>
                  <TableCell>{getCourseName(attendance.class.course)}</TableCell>
                  <TableCell>
                    {attendance.class.students
                      .map((student) => getFullNameFromStudent(student))
                      .join(", ")}
                  </TableCell>
                  <TableCell>{getFullNameFromTeacher(attendance.teacher)}</TableCell>
                  <TableCell>{moment(attendance.date).format("DD MMMM YYYY, HH:mm")}</TableCell>
                  <TableCell>{attendance.duration}</TableCell>
                  <TableCell>{attendance.usedStudentTokenQuota}</TableCell>
                  <TableCell>{attendance.note}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => onRemove(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

AttendanceBatchTable.displayName = "AttendanceBatchTable";
