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
import Tooltip from "@sonamusica-fe/components/Tooltip";

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
    <Table stickyHeader sx={{ "& .MuiTableCell-root": { py: 1.5 } }}>
      <TableHead>
        <TableRow>
          <StyledTableCell sx={{ maxWidth: 64 }}></StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 64 }}>Is Paid</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 200 }}>Date</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 200 }}>Duration (minutes)</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: 100 }}>Used Quota</StyledTableCell>
          <StyledTableCell>Notes</StyledTableCell>
          <StyledTableCell>Teacher Substitute</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow
            hover
            key={item.attendanceId}
            className={item.isPaid ? "" : "attendance-unpaid-row"}
          >
            <StyledTableCell>
              <Tooltip
                content={
                  item.isPaid
                    ? "De-register this attendance from the teacher payment to edit/delete"
                    : ""
                }
              >
                <>
                  <IconButton
                    disabled={item.isPaid ? true : false}
                    onClick={() => openForm(item)}
                    color="secondary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    disabled={item.isPaid ? true : false}
                    onClick={() => handleDelete(item)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </>
              </Tooltip>
            </StyledTableCell>
            <StyledTableCell>
              <Typography
                color={(theme) =>
                  item.isPaid ? theme.palette.success.main : theme.palette.error.main
                }
                fontWeight="bold"
              >
                {item.isPaid ? "Yes" : "No"}
              </Typography>
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
            {/* TODO(FerdiantJoshua): add new column, contains a button to show which studentLearningToken this attendance is using (there are some detail, so we should use modal) */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceDetailTableView;
