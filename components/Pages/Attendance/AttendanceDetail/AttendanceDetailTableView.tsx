import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Delete, Edit } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses
} from "@mui/material";
import { styled } from "@mui/system";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Attendance } from "@sonamusica-fe/types";
import { getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { FailedResponse } from "api";

type AttendanceDetailTableViewProps = {
  data: Attendance[];
  teacherId: number;
  openForm: (data: Attendance) => void;
  onDelete: () => void;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center"
  }
}));

const AttendanceDetailTableView = ({
  data,
  teacherId,
  openForm,
  onDelete
}: AttendanceDetailTableViewProps): JSX.Element => {
  const { showDialog } = useAlertDialog();

  const apiTransformer = useApiTransformer();

  const handleDelete = (attendance: Attendance) => {
    showDialog(
      {
        title: "Delete Attendance",
        content: (
          <>
            <Typography variant="h4" fontSize={20}>
              Are you sure to delete this attendance?
            </Typography>
            <Divider sx={{ borderWidth: "2px", my: 3, mx: -2 }} />
            <FormDataViewerTable
              tableProps={{ size: "small", sx: { mt: 1 } }}
              tableRowProps={{
                sx: {
                  "& .MuiTableCell-root:first-child": {
                    width: "160px",
                    pl: 0
                  }
                }
              }}
              data={[
                { title: "Date", value: moment(attendance.date).format("DD MMMM YYYY HH:mm:ss") },
                { title: "Duration", value: `${attendance.duration} minutes` },
                { title: "Used Quota", value: attendance.usedStudentTokenQuota.toString() },
                { title: "Notes", value: attendance.note },
                {
                  title: "Teacher Substitute",
                  value:
                    attendance.teacher.teacherId !== teacherId
                      ? getFullNameFromTeacher(attendance.teacher)
                      : "-"
                },
                { title: "Is Paid", value: attendance.isPaid ? "Yes" : "No" }
              ]}
              CellValueComponent={Typography}
              cellValueComponentProps={{ variant: "h5", fontSize: 16 }}
            />
          </>
        )
      },
      () => {
        API.RemoveAttendance(attendance.attendanceId).then((response) => {
          const parsedResponse = apiTransformer(response, true);

          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            onDelete();
          }
        });
      }
    );
  };

  return (
    <Table sx={{ "& .MuiTableCell-root": { py: 1.5 } }}>
      <TableHead>
        <TableRow>
          <StyledTableCell sx={{ maxWidth: 64 }}></StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 200 }}>Date</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 200 }}>Duration (minutes)</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 100 }}>Used Quota</StyledTableCell>
          <StyledTableCell>Notes</StyledTableCell>
          <StyledTableCell>Teacher Substitute</StyledTableCell>
          <StyledTableCell>Is Paid</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow hover key={item.attendanceId}>
            <StyledTableCell>
              <IconButton onClick={() => openForm(item)} color="secondary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(item)} color="error">
                <Delete />
              </IconButton>
            </StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center", maxWidth: 200 }}>
              {moment(item.date).format("DD MMMM YYYY HH:mm:ss")}
            </StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center", maxWidth: 200 }}>
              {item.duration}
            </StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center", maxWidth: 200 }}>
              {item.usedStudentTokenQuota}
            </StyledTableCell>
            <StyledTableCell>{item.note}</StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center" }}>
              {item.teacher.teacherId !== teacherId ? getFullNameFromTeacher(item.teacher) : "-"}
            </StyledTableCell>
            <StyledTableCell>{item.isPaid ? "Yes" : "No"}</StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceDetailTableView;
