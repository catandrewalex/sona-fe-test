import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TableContainer } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import PresenceDetailTableView from "@sonamusica-fe/components/Pages/Presence/PresenceDetail/PresenceDetailTableView";
import Pagination from "@sonamusica-fe/components/Pagination";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Presence, Student } from "@sonamusica-fe/types";
import { getFullNameFromStudent } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import React, { useCallback, useEffect, useState } from "react";

type PresenceDetailTabContainerProps = {
  classId: number;
  teacherId: number;
  studentsData: Student[];
};

type PaginationConfig = {
  page: number;
  maxPage: number;
  onChange?: (page: number) => void;
};

function filterPresenceByStudents(id: number, data: Presence[]) {
  return data.filter((presence) => presence.student.studentId === id);
}

const PresenceDetailTabContainer = ({
  classId,
  teacherId,
  studentsData
}: PresenceDetailTabContainerProps): JSX.Element => {
  const [tabValue, setTabValue] = useState<number>(studentsData[0].studentId);
  const [presenceData, setPresenceData] = useState<Presence[]>([]);
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

  const fetchPresence = () => {
    setLoading(true);
    API.GetPresenceByClass({
      page: paginationConfig.page,
      resultsPerPage: studentsData.length * 10,
      classId
    })
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          const results = parsedResponse as ResponseMany<Presence>;
          setPresenceData(results.results);
          setPaginationConfig({ ...paginationConfig, maxPage: results.totalPages });
        } else {
          showSnackbar("Failed to fetch presence data!", "error");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPresence();
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
                <PresenceDetailTableView
                  currPage={paginationConfig.page}
                  data={filterPresenceByStudents(tabValue, presenceData)}
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

export default PresenceDetailTabContainer;
