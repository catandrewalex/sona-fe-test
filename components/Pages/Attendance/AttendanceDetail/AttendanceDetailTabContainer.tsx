import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TableContainer } from "@mui/material";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import AttendanceDetailTableView from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTableView";
import Pagination from "@sonamusica-fe/components/Pagination";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Attendance, Student } from "@sonamusica-fe/types";
import { getFullNameFromStudent } from "@sonamusica-fe/utils/StringUtil";
import React, { useCallback, useEffect, useState } from "react";
import useAttendanceFetch from "../useAttendanceFetch";

type AttendanceDetailTabContainerProps = {
  studentsData: Student[];
  classId: number;
  teacherId: number;
  openForm: (data: Attendance) => void;
  preSelectedStudentId: number;
  forceRenderCounter: number;
};

const resultPerPage = 12;

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
    data: attendanceData,
    paginationResult,
    error,
    isLoading: loading,
    refetch
  } = useAttendanceFetch(classId, currentStudentId, resultPerPage);

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  useEffect(() => {
    if (forceRenderCounter > 0) {
      refetch(currentStudentId, paginationResult.currentPage);
    }
  }, [forceRenderCounter]);

  const handleTabChange = useCallback(
    (_e, newValue) => {
      const newStudentId = parseInt(newValue);
      setCurrentStudentId(newStudentId);
      refetch(currentStudentId, paginationResult.currentPage);
    },
    [currentStudentId, paginationResult.currentPage]
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      refetch(currentStudentId, page);
    },
    [currentStudentId]
  );

  const onDelete = useCallback(() => {
    refetch(currentStudentId, paginationResult.currentPage);
  }, [refetch, currentStudentId, paginationResult.currentPage]);

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
            <TableContainer sx={{ height: "calc(100vh - 336px)" }}>
              {loading ? (
                <LoaderSimple />
              ) : (
                // TODO(FerdiantJoshua): in each student tab, show latest SLT quota & all non-latest non-zero SLT quota
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

export default AttendanceDetailTabContainer;
