import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TableContainer, Typography } from "@mui/material";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import AttendanceDetailTableView from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTableView";
import Pagination from "@sonamusica-fe/components/Pagination";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Attendance, Student, StudentLearningTokenDisplay } from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  getFullNameFromStudent
} from "@sonamusica-fe/utils/StringUtil";
import React, { useCallback, useEffect, useState } from "react";
import useAttendanceFetch from "../useAttendanceFetch";
import useStudentLearningTokenDisplayFetch from "@sonamusica-fe/components/Pages/Attendance/useStudentLearningTokenDisplayFetch";
import moment from "moment";

type AttendanceDetailTabContainerProps = {
  studentsData: Student[];
  classId: number;
  teacherId: number;
  isUserHasWriteAccess: boolean;
  openForm: (data: Attendance) => void;
  preSelectedStudentId: number;
  forceRenderCounter: number;
  isDisplayForSharing?: boolean;
};

const RESULT_PER_PAGE = 12;

function isIdExistOnStudents(id: number, students: Student[]): boolean {
  return students.findIndex((student) => student.studentId === id) !== -1;
}

const AttendanceDetailTabContainer = ({
  studentsData,
  classId,
  teacherId,
  isUserHasWriteAccess,
  openForm,
  preSelectedStudentId,
  forceRenderCounter,
  isDisplayForSharing
}: AttendanceDetailTabContainerProps): JSX.Element => {
  const { showSnackbar } = useSnack();
  const [currentStudentId, setCurrentStudentId] = useState<number>(
    isIdExistOnStudents(preSelectedStudentId, studentsData)
      ? preSelectedStudentId
      : studentsData[0].studentId
  );

  const {
    data: studentLearningTokenData,
    error: errorStudentLearningToken,
    refetch: refetchStudentLearningToken
  } = useStudentLearningTokenDisplayFetch(classId);

  const {
    data: attendanceData,
    paginationState,
    error: errorAttendance,
    isLoading: loading,
    refetch: refetchAttendance
  } = useAttendanceFetch(classId, currentStudentId, RESULT_PER_PAGE);

  useEffect(() => {
    if (errorAttendance) {
      showSnackbar(errorAttendance, "error");
    }
  }, [errorAttendance, showSnackbar]);

  useEffect(() => {
    if (errorStudentLearningToken) {
      showSnackbar(errorStudentLearningToken, "error");
    }
  }, [errorStudentLearningToken, showSnackbar]);

  // everytime an attendance is edited/submitted, we must update the (1) attendance table, (2) displayed student's SLT remaining quota.
  //   Thus, we subscribe to "forceRenderCounter"
  useEffect(() => {
    if (forceRenderCounter > 0) {
      refetchAttendance(currentStudentId, paginationState.currentPage);
      refetchStudentLearningToken();
    }
  }, [forceRenderCounter]);

  const handleTabChange = useCallback(
    (_e, newValue) => {
      const newStudentId = parseInt(newValue);
      setCurrentStudentId(newStudentId);
      refetchAttendance(currentStudentId, paginationState.currentPage);
    },
    [currentStudentId, paginationState.currentPage]
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      refetchAttendance(currentStudentId, page);
    },
    [currentStudentId]
  );

  const onDelete = useCallback(() => {
    refetchAttendance(currentStudentId, paginationState.currentPage);
    refetchStudentLearningToken();
  }, [currentStudentId, paginationState.currentPage]);

  const studentIdToSLTDisplay: Record<number, StudentLearningTokenDisplay[]> = {};
  if (studentLearningTokenData) {
    studentLearningTokenData.forEach((studentWithSLTsDisplay) => {
      studentIdToSLTDisplay[studentWithSLTsDisplay.studentId] =
        studentWithSLTsDisplay.studentLearningTokens;
    });
  }

  return (
    <Box mt={1}>
      <TabContext value={currentStudentId + ""}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            {studentsData.map((student) => (
              <Tab
                key={student.studentId}
                label={getFullNameFromStudent(student)}
                value={student.studentId + ""}
              />
            ))}
          </TabList>
        </Box>
        {studentsData.map((student) => (
          <TabPanel key={student.studentId} value={student.studentId + ""}>
            {studentIdToSLTDisplay[student.studentId] &&
              (isDisplayForSharing
                ? [studentIdToSLTDisplay[student.studentId][0]]
                : studentIdToSLTDisplay[student.studentId]
              ).map((data) => (
                <Box key={data.studentLearningTokenId}>
                  <Typography
                    component="span"
                    sx={{ mr: 0.25, opacity: isDisplayForSharing ? 0.2 : 1 }}
                  >
                    <small>#{data.studentLearningTokenId}</small>
                  </Typography>
                  <Typography fontSize={16} component="span" sx={{ mr: 0.25, ml: 0.25 }}>
                    |
                  </Typography>
                  <Typography
                    sx={{ mr: 1, ml: 0.25 }}
                    component="span"
                    color={(theme) =>
                      data.quota === 0
                        ? theme.palette.success.main
                        : data.quota === -1 || data.quota === 1
                        ? theme.palette.warning.main
                        : theme.palette.error.main
                    }
                    fontWeight="bold"
                  >
                    Remaining Quota: {data.quota}
                  </Typography>
                  <Typography fontSize={16} component="span" sx={{ mr: 0.5, ml: 0.5 }}>
                    |
                  </Typography>
                  {!isDisplayForSharing ? (
                    <>
                      <Typography component="span" sx={{ mx: 1 }}>
                        <small>Active: {moment(data.createdAt).format("DD MMMM YYYY")}</small>
                      </Typography>
                      <Typography fontSize={16} component="span" sx={{ mr: 0.5, ml: 0.5 }}>
                        |
                      </Typography>
                    </>
                  ) : null}
                  <Typography component="span" sx={{ ml: 1 }}>
                    <small>
                      ({convertNumberToCurrencyString(data.courseFeeValue)} (Course) +{" "}
                      {convertNumberToCurrencyString(data.transportFeeValue)} (Transport))
                    </small>
                  </Typography>
                </Box>
              ))}

            {!loading && !studentIdToSLTDisplay[student.studentId] && (
              <>
                <Typography
                  component="span"
                  color={(theme) => theme.palette.error.main}
                  fontWeight="bold"
                >
                  This student does not have any learning token.
                </Typography>
                <Typography component="span" sx={{ ml: 0.5 }}>
                  <small>(Has the student paid the enrollment fee?)</small>
                </Typography>
              </>
            )}

            {/* TODO(FerdiantJoshua): set this TableContainer, not to have excess width on lots of column & small screens */}
            <TableContainer sx={{ mt: 2, height: "calc(100vh - 376px)" }}>
              {loading ? (
                <LoaderSimple />
              ) : (
                <AttendanceDetailTableView
                  data={attendanceData}
                  teacherId={teacherId}
                  isUserHasWriteAccess={isUserHasWriteAccess}
                  openForm={openForm}
                  onDelete={onDelete}
                  isDisplayForSharing={isDisplayForSharing}
                />
              )}
            </TableContainer>
          </TabPanel>
        ))}
      </TabContext>
      <Pagination
        count={paginationState.totalPages}
        page={paginationState.currentPage}
        onChange={handlePageChange}
      />
    </Box>
  );
};

export default React.memo(AttendanceDetailTabContainer);
