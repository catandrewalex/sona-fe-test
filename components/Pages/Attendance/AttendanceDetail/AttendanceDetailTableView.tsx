import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
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
import {
  convertNumberToCurrencyString,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React, { useState } from "react";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { FailedResponse } from "api";
import Tooltip from "@sonamusica-fe/components/Tooltip";
import useModalRenderer from "@sonamusica-fe/components/Modal/ModalRenderer";

type AttendanceDetailTableViewProps = {
  data: Attendance[];
  teacherId: number;
  isUserHasWriteAccess: boolean;
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
  isUserHasWriteAccess,
  openForm,
  onDelete
}: AttendanceDetailTableViewProps): JSX.Element => {
  const { showDialog } = useAlertDialog();
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance>();
  const { openModal: openModalTokenDetail, ModalRenderer } = useModalRenderer({
    onClose: () => setSelectedAttendance(undefined),
    closeIcon: true,
    minWidth: "30vw",
    maxWidth: "75vw"
  });

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

  const onClickViewTokenDetail = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    openModalTokenDetail();
  };

  return (
    <>
      <Table stickyHeader sx={{ "& .MuiTableCell-root": { py: 1.5 } }}>
        <TableHead>
          <TableRow>
            {isUserHasWriteAccess && <StyledTableCell sx={{ maxWidth: 64 }}></StyledTableCell>}
            <StyledTableCell sx={{ maxWidth: 64 }}>Is Paid</StyledTableCell>
            <StyledTableCell sx={{ maxWidth: 200 }}>Date</StyledTableCell>
            <StyledTableCell sx={{ maxWidth: 200 }}>Duration (minutes)</StyledTableCell>
            <StyledTableCell sx={{ maxWidth: 100 }}>Used Quota</StyledTableCell>
            <StyledTableCell>Notes</StyledTableCell>
            <StyledTableCell>Teacher Substitute</StyledTableCell>
            <StyledTableCell>Token Detail</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              hover
              key={item.attendanceId}
              className={item.isPaid ? "" : "attendance-unpaid-row"}
            >
              {isUserHasWriteAccess && (
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
              )}
              <StyledTableCell>
                <Typography
                  align="center"
                  color={(theme) =>
                    item.isPaid ? theme.palette.success.main : theme.palette.error.main
                  }
                  fontWeight="bold"
                >
                  {item.isPaid ? "Yes" : "No"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center", maxWidth: 200 }}>
                {moment(item.date).format("DD MMMM YYYY HH:mm")}
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
              <StyledTableCell>
                <Button color="primary" onClick={() => onClickViewTokenDetail(item)}>
                  View #{item.studentLearningToken.studentLearningTokenId}
                </Button>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAttendance && (
        <ModalRenderer>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Token #{selectedAttendance.studentLearningToken.studentLearningTokenId} Detail
          </Typography>
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
              {
                title: "Remaining Quota",
                value: selectedAttendance.studentLearningToken.quota.toString()
              },
              {
                title: "Active",
                value: moment(selectedAttendance.studentLearningToken.createdAt).format(
                  "DD MMMM YYYY HH:mm"
                )
              },
              {
                title: "Last Updated",
                value: moment(selectedAttendance.studentLearningToken.lastUpdatedAt).format(
                  "DD MMMM YYYY HH:mm"
                )
              },
              {
                title: "Course Fee",
                value: convertNumberToCurrencyString(
                  selectedAttendance.studentLearningToken.courseFeeValue
                )
              },
              {
                title: "Transport Fee",
                value: convertNumberToCurrencyString(
                  selectedAttendance.studentLearningToken.transportFeeValue
                )
              }
            ]}
            CellValueComponent={Typography}
            cellValueComponentProps={{ variant: "h5", fontSize: 16 }}
          />
        </ModalRenderer>
      )}
    </>
  );
};

export default AttendanceDetailTableView;
