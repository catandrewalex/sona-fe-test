import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TableContainer } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import AttendanceDetailTableView from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTableView";
import Pagination from "@sonamusica-fe/components/Pagination";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Attendance, Student } from "@sonamusica-fe/types";
import { getFullNameFromStudent } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import React, { useCallback, useEffect, useState } from "react";

type AttendanceDetailTabContainerProps = {
  classId: number;
  teacherId: number;
  studentsData: Student[];
};

type PaginationConfig = {
  page: number;
  maxPage: number;
  onChange?: (page: number) => void;
};

function filterAttendanceByStudents(id: number, data: Attendance[]) {
  return data.filter((attendance) => attendance.student.studentId === id);
}

const AttendanceDetailTabContainer = ({
  classId,
  teacherId,
  studentsData
}: AttendanceDetailTabContainerProps): JSX.Element => {
  const [tabValue, setTabValue] = useState<number>(studentsData[0].studentId);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    page: 1,
    maxPage: 1
  });
  const [loading, setLoading] = useState<boolean>(true);
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  const handleTabChange = useCallback((_e, newValue) => {
    setTabValue(parseInt(newValue));
  }, []);

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setPaginationConfig({ ...paginationConfig, page });
    },
    [paginationConfig.maxPage]
  );

  const fetchAttendance = () => {
    setLoading(true);
    API.GetAttendanceByClass({
      page: paginationConfig.page,
      resultsPerPage: studentsData.length * 10,
      classId
    })
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          const results = parsedResponse as ResponseMany<Attendance>;
          setAttendanceData(results.results);
          setPaginationConfig({ ...paginationConfig, maxPage: results.totalPages });
        } else {
          showSnackbar("Failed to fetch attendance data!", "error");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance();
  }, [paginationConfig.page, tabValue]);

  return (
    <Box mt={1}>
      <TabContext value={tabValue + ""}>
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
                <AttendanceDetailTableView
                  currPage={paginationConfig.page}
                  data={filterAttendanceByStudents(tabValue, attendanceData)}
                  teacherId={teacherId}
                />
              )}
            </TableContainer>
          </TabPanel>
        ))}
      </TabContext>
      <Pagination
        count={paginationConfig.maxPage}
        page={paginationConfig.page}
        onChange={handlePageChange}
      />
    </Box>
  );
};

export default AttendanceDetailTabContainer;
