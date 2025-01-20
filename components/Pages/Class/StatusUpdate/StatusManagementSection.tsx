import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import type {
  TabType,
  StatusChangeMap,
  SearchState
} from "@sonamusica-fe/components/Pages/Class/types";
import { StatusTabNavigation } from "@sonamusica-fe/components/Pages/Class/StatusUpdate/StatusTabNavigation";
import { StatusList } from "@sonamusica-fe/components/Pages/Class/StatusUpdate/StatusList";
import { StatusChangesPreview } from "@sonamusica-fe/components/Pages/Class/StatusUpdate/StatusChangesPreview";
import { Class, EditClassConfigRequest, PaginationState } from "@sonamusica-fe/types";
import {
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { CalculatePaginationTotalPages } from "@sonamusica-fe/utils/GeneralUtil";
import { FailedResponse } from "api";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import { SmallCancelAndSubmitButtons } from "@sonamusica-fe/components/Form/SmallCancelAndSubmitButtons";

interface StatusManagementSectionProps {
  classData: Class[];
  itemsPerPage: number;
  dataLoading: boolean;
  refetchClass: () => void;
}

// TODO: replace these AI-generated components with our FE components
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  }
}));

const StatusGridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  }
}));

export const StatusManagementSection = ({
  classData,
  itemsPerPage,
  dataLoading,
  refetchClass
}: StatusManagementSectionProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  const [loading, setLoading] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<TabType>("status");
  const [statusChanges, setStatusChanges] = useState<StatusChangeMap>(new Map());
  const [autoOweTokenChanges, setAutoOweTokenChanges] = useState<StatusChangeMap>(new Map());

  const [searchState, setSearchState] = useState<SearchState>({
    teacherName: "",
    studentName: "",
    courseName: ""
  });

  const [activeClassPagination, setActiveClassPagination] = useState<PaginationState>({
    totalPages: 0,
    totalItems: 0,
    currentPage: 1
  });
  const [inactiveClassPagination, setInactiveClassPagination] = useState<PaginationState>({
    totalPages: 0,
    totalItems: 0,
    currentPage: 1
  });

  const filteredClasses = useMemo(() => {
    return classData.filter((cls) => {
      const teacherName = getFullNameFromTeacher(cls.teacher).toLowerCase();
      const studentNames = cls.students
        .map((student) => getFullNameFromStudent(student))
        .join(" ")
        .toLowerCase();
      const courseName = getCourseName(cls.course).toLowerCase();

      const teacherNameMatch =
        !searchState.teacherName || teacherName.includes(searchState.teacherName);

      const studentNameMatch =
        !searchState.studentName || studentNames.includes(searchState.studentName);

      const courseNameMatch =
        !searchState.courseName || courseName.includes(searchState.courseName);

      return teacherNameMatch && studentNameMatch && courseNameMatch;
    });
  }, [classData, searchState]);

  const { activeClasses, inactiveClasses } = useMemo(() => {
    const property = currentTab === "status" ? "isDeactivated" : "autoOweAttendanceToken";
    let activeClasses: Class[] = [];
    let inactiveClasses: Class[] = [];

    if (currentTab == "status") {
      activeClasses = filteredClasses.filter((cls) => !cls[property]);
      inactiveClasses = filteredClasses.filter((cls) => cls[property]);
    } else {
      activeClasses = filteredClasses.filter((cls) => cls[property]);
      inactiveClasses = filteredClasses.filter((cls) => !cls[property]);
    }

    return { activeClasses, inactiveClasses };
  }, [filteredClasses, currentTab]);

  useEffect(() => {
    setActiveClassPagination({
      totalPages: CalculatePaginationTotalPages(activeClasses.length, itemsPerPage),
      totalItems: activeClasses.length,
      currentPage: 1
    });
    setInactiveClassPagination({
      totalPages: CalculatePaginationTotalPages(inactiveClasses.length, itemsPerPage),
      totalItems: inactiveClasses.length,
      currentPage: 1
    });
  }, [activeClasses, inactiveClasses, itemsPerPage]);

  // Handlers
  const handleTabChange = useCallback((newTab: TabType) => {
    setCurrentTab(newTab);
  }, []);

  const resetPagination = useCallback(() => {
    setActiveClassPagination((prev) => ({
      ...prev,
      currentPage: 1
    }));
    setInactiveClassPagination((prev) => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  const handleStatusChanges = useCallback(
    (classId: number, property: "isDeactivated" | "autoOweAttendanceToken") => {
      const changeMap = property === "isDeactivated" ? statusChanges : autoOweTokenChanges;
      const setChangeMap = property === "isDeactivated" ? setStatusChanges : setAutoOweTokenChanges;

      if (changeMap.has(classId)) {
        const newMap = new Map(changeMap);
        newMap.delete(classId);
        setChangeMap(newMap);
      } else {
        const classItem = classData.find((c) => c.classId === classId);
        if (classItem) {
          const newMap = new Map(changeMap);
          newMap.set(classId, {
            classId: classId,
            property,
            newValue: !classItem[property]
          });
          setChangeMap(newMap);
        }
      }
    },
    [classData, statusChanges, autoOweTokenChanges]
  );

  const clearChanges = useCallback(() => {
    setStatusChanges(new Map());
    setAutoOweTokenChanges(new Map());
  }, []);

  const handleSubmit = useCallback(async () => {
    if (statusChanges.size === 0 && autoOweTokenChanges.size === 0) {
      showSnackbar("Please add at least one status or auto-owe token change", "error");
      return;
    }

    setLoading(true);

    // merge both changes into a single object
    const configChanges = new Map<number, EditClassConfigRequest>();
    statusChanges.forEach((statusChange, classId) => {
      configChanges.set(classId, {
        classId: statusChange.classId,
        isDeactivated: statusChange.newValue
      });
    });
    autoOweTokenChanges.forEach((autoOweTokenChange, classId) => {
      const prev = configChanges.get(classId);
      if (prev) {
        prev.autoOweAttendanceToken = autoOweTokenChange.newValue;
      } else {
        configChanges.set(classId, {
          classId: autoOweTokenChange.classId,
          autoOweAttendanceToken: autoOweTokenChange.newValue
        });
      }
    });
    const editClassConfigRequests = Array.from(configChanges.values());

    const response = await API.EditClassesConfigs(editClassConfigRequests);
    const parsedResponse = apiTransformer(response, true);
    if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
      return parsedResponse as FailedResponse;
    } else {
      clearChanges();
      refetchClass();
    }
    setLoading(false);
  }, [showSnackbar, statusChanges, autoOweTokenChanges, clearChanges]);

  return (
    <Box>
      <StatusTabNavigation currentTab={currentTab} onTabChange={handleTabChange} />

      <SearchContainer>
        <TextField
          fullWidth
          placeholder="Search by teacher name..."
          value={searchState.teacherName}
          onChange={useCallback(
            (e) => {
              setSearchState((prev) => ({
                ...prev,
                teacherName: e.target.value
              }));
              resetPagination();
            },
            [resetPagination]
          )}
        />
        <TextField
          fullWidth
          placeholder="Search by student name..."
          value={searchState.studentName}
          onChange={useCallback(
            (e) => {
              setSearchState((prev) => ({
                ...prev,
                studentName: e.target.value
              }));
              resetPagination();
            },
            [resetPagination]
          )}
        />
        <TextField
          fullWidth
          placeholder="Search by course name..."
          value={searchState.courseName}
          onChange={useCallback(
            (e) => {
              setSearchState((prev) => ({
                ...prev,
                courseName: e.target.value
              }));
              resetPagination();
            },
            [resetPagination]
          )}
        />
      </SearchContainer>

      {dataLoading ? (
        <LoaderSimple />
      ) : (
        <StatusGridContainer>
          <StatusList
            title={currentTab === "status" ? "Active" : "Enabled"}
            classData={activeClasses}
            property={currentTab === "status" ? "isDeactivated" : "autoOweAttendanceToken"}
            changeMap={currentTab === "status" ? statusChanges : autoOweTokenChanges}
            paginationState={activeClassPagination}
            onStatusChange={handleStatusChanges}
            onPaginationChange={(page) =>
              setActiveClassPagination((prev) => ({ ...prev, currentPage: page }))
            }
            itemsPerPage={itemsPerPage}
          />
          <StatusList
            title={currentTab === "status" ? "Inactive" : "Disabled"}
            classData={inactiveClasses}
            property={currentTab === "status" ? "isDeactivated" : "autoOweAttendanceToken"}
            changeMap={currentTab === "status" ? statusChanges : autoOweTokenChanges}
            paginationState={inactiveClassPagination}
            onStatusChange={handleStatusChanges}
            onPaginationChange={(page) =>
              setInactiveClassPagination((prev) => ({ ...prev, currentPage: page }))
            }
            itemsPerPage={itemsPerPage}
          />
        </StatusGridContainer>
      )}

      <StatusChangesPreview
        statusChanges={statusChanges}
        autoOweTokenChanges={autoOweTokenChanges}
        classes={classData}
      />

      <SmallCancelAndSubmitButtons
        loading={loading}
        cancelButtonText="Clear Changes"
        cancelButtonDisabled={
          loading || (statusChanges.size === 0 && autoOweTokenChanges.size === 0)
        }
        cancelButtonOnClick={clearChanges}
        submitButtonText="Submit Changes"
        submitButtonDisabled={statusChanges.size === 0 && autoOweTokenChanges.size === 0}
        submitButtonOnClick={handleSubmit}
      ></SmallCancelAndSubmitButtons>
    </Box>
  );
};
