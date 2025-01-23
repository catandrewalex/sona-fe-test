import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { styled } from "@mui/system";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Attendance, StudentWithStudentLearningTokensDisplay } from "@sonamusica-fe/types";
import { getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React, { useState } from "react";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { FailedResponse } from "api";
import Tooltip from "@sonamusica-fe/components/Tooltip";
import useModalRenderer from "@sonamusica-fe/components/Modal/ModalRenderer";
import AttendanceDetailTokenView from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTokenView";

type AttendanceDetailTableViewProps = {
  data: Attendance[];
  studentsWithTokens: StudentWithStudentLearningTokensDisplay[];
  teacherId: number;
  isUserHasWriteAccess: boolean;
  openForm: (data: Attendance) => void;
  refetchAllData: () => void;
  isDisplayForSharing?: boolean;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center"
  }
}));

function getAttendanceRowClassName(
  isPaid: boolean,
  hasToken: boolean,
  isDisplayForSharing?: boolean
): string {
  if (isDisplayForSharing) {
    return "";
  }
  if (!hasToken) {
    return "attendance-no-token-row";
  }
  if (!isPaid) {
    return "attendance-unpaid-row";
  }
  return "";
}

const AttendanceDetailTableView = ({
  data,
  studentsWithTokens,
  teacherId,
  isUserHasWriteAccess,
  openForm,
  refetchAllData,
  isDisplayForSharing
}: AttendanceDetailTableViewProps): JSX.Element => {
  const { showDialog } = useAlertDialog();
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance>();
  const {
    openModal: openModalTokenDetail,
    closeModal: closeModalTokenDetail,
    ModalRenderer
  } = useModalRenderer({
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
            refetchAllData();
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
            {isUserHasWriteAccess && !isDisplayForSharing && (
              <>
                <StyledTableCell sx={{ maxWidth: 64 }}></StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 64 }}>Is Paid</StyledTableCell>
              </>
            )}
            <StyledTableCell sx={{ maxWidth: 200 }}>Date</StyledTableCell>
            <StyledTableCell sx={{ maxWidth: 200 }}>Duration (minutes)</StyledTableCell>
            <StyledTableCell sx={{ maxWidth: 100 }}>Used Quota</StyledTableCell>
            <StyledTableCell>Notes</StyledTableCell>
            <StyledTableCell>Teacher Substitute</StyledTableCell>
            {!isDisplayForSharing && <StyledTableCell>Token Detail</StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              hover
              key={item.attendanceId}
              className={getAttendanceRowClassName(
                item.isPaid,
                item.studentLearningToken.studentLearningTokenId !== 0,
                isDisplayForSharing
              )}
            >
              {isUserHasWriteAccess && !isDisplayForSharing && (
                <>
                  <StyledTableCell>
                    <Tooltip
                      title={
                        item.isPaid
                          ? "De-register this attendance from the teacher payment to edit/delete"
                          : ""
                      }
                    >
                      <>
                        <IconButton
                          disabled={item.isPaid}
                          onClick={() => openForm(item)}
                          color="secondary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          disabled={item.isPaid}
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
                      align="center"
                      color={(theme) =>
                        item.isPaid ? theme.palette.success.main : theme.palette.error.main
                      }
                      fontWeight="bold"
                    >
                      {item.isPaid ? "Yes" : "No"}
                    </Typography>
                  </StyledTableCell>
                </>
              )}
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
              {!isDisplayForSharing && (
                <StyledTableCell>
                  {item.studentLearningToken.studentLearningTokenId ? (
                    <Button color="primary" onClick={() => onClickViewTokenDetail(item)}>
                      View #{item.studentLearningToken.studentLearningTokenId}
                    </Button>
                  ) : (
                    <Tooltip
                      title={!isUserHasWriteAccess ? "Contact admin to assign the token" : ""}
                    >
                      <Button
                        color="error"
                        disabled={!isUserHasWriteAccess}
                        onClick={() => onClickViewTokenDetail(item)}
                      >
                        Assign
                      </Button>
                    </Tooltip>
                  )}
                </StyledTableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAttendance && (
        <ModalRenderer>
          <AttendanceDetailTokenView
            selectedAttendance={selectedAttendance}
            studentLearningTokenOptions={
              studentsWithTokens.find(
                (val) => val.studentId === selectedAttendance.student.studentId
              )?.studentLearningTokens
            }
            isUserHasWriteAccess={isUserHasWriteAccess}
            refetchAllData={refetchAllData}
            onCancel={closeModalTokenDetail}
          ></AttendanceDetailTokenView>
        </ModalRenderer>
      )}
    </>
  );
};

export default AttendanceDetailTableView;
