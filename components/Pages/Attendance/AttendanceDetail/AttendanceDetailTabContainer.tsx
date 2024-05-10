import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TableContainer, Typography } from "@mui/material";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import AttendanceDetailTableView from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTableView";
import Pagination from "@sonamusica-fe/components/Pagination";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import {
  Attendance,
  Student,
  StudentLearningTokenDisplay,
  StudentWithStudentLearningTokensDisplay
} from "@sonamusica-fe/types";
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
  openForm: (data: Attendance) => void;
  preSelectedStudentId: number;
  forceRenderCounter: number;
};

const RESULT_PER_PAGE = 12;

function isIdExistOnStudents(id: number, students: Student[]): boolean {
  return students.findIndex((student) => student.studentId === id) !== -1;
}

const AttendanceDetailTabContainer = ({
  studentsData,
  classId,
  teacherId,
  openForm,
  preSelectedStudentId,
  forceRenderCounter
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
    paginationResult,
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
      refetchAttendance(currentStudentId, paginationResult.currentPage);
      refetchStudentLearningToken();
    }
  }, [forceRenderCounter]);

  const handleTabChange = useCallback(
    (_e, newValue) => {
      const newStudentId = parseInt(newValue);
      setCurrentStudentId(newStudentId);
      refetchAttendance(currentStudentId, paginationResult.currentPage);
    },
    [currentStudentId, paginationResult.currentPage]
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      refetchAttendance(currentStudentId, page);
    },
    [currentStudentId]
  );

  const onDelete = useCallback(() => {
    refetchAttendance(currentStudentId, paginationResult.currentPage);
    refetchStudentLearningToken();
  }, [currentStudentId, paginationResult.currentPage]);

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
              studentIdToSLTDisplay[student.studentId].map((data) => (
                <Box key={data.studentLearningTokenId}>
                  <Typography
                    sx={{ mr: 1 }}
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
                  <Typography component="span" sx={{ mx: 1 }}>
                    <small>Active: {moment(data.createdAt).format("DD MMMM YYYY")}</small>
                  </Typography>
                  <Typography fontSize={16} component="span" sx={{ mr: 0.5, ml: 0.5 }}>
                    |
                  </Typography>
                  <Typography component="span" sx={{ ml: 1 }}>
                    <small>
                      ({convertNumberToCurrencyString(data.courseFeeValue)} (Course) +{" "}
                      {convertNumberToCurrencyString(data.transportFeeValue)} (Transport))
                    </small>
                  </Typography>
                </Box>
              ))}

            <TableContainer sx={{ mt: 2, height: "calc(100vh - 376px)" }}>
              {loading ? (
                <LoaderSimple />
              ) : (
                <AttendanceDetailTableView
                  data={attendanceData}
                  teacherId={teacherId}
                  openForm={openForm}
                  onDelete={onDelete}
                />
              )}
            </TableContainer>
          </TabPanel>
        ))}
      </TabContext>
      <Pagination
        count={paginationResult.totalPages}
        page={paginationResult.currentPage}
        onChange={handlePageChange}
      />
    </Box>
  );
};

export default React.memo(AttendanceDetailTabContainer);
