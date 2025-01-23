import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography, FormControl, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CourseChangeMap, SearchState } from "@sonamusica-fe/components/Pages/Class/types";
import { Class, Course, EditClassCourseRequest, PaginationState } from "@sonamusica-fe/types";
import { CourseChangesPreview } from "@sonamusica-fe/components/Pages/Class/CourseUpdate/CourseChangesPreview";
import { ClassSelectionList } from "@sonamusica-fe/components/Pages/Class/CourseUpdate/ClassSelectionList";
import {
  getCourseName,
  getMinimalClassName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { CalculatePaginationTotalPages } from "@sonamusica-fe/utils/GeneralUtil";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse } from "api";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import { SmallCancelAndSubmitButtons } from "@sonamusica-fe/components/Form/SmallCancelAndSubmitButtons";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";

interface CourseUpdateSectionProps {
  classData: Class[];
  courseData: Course[];
  itemsPerPage: number;
  dataLoading: boolean;
  refetchClass: () => void;
}

// TODO: replace these AI-generated components with our FE components
const UpdateContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr"
  }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  }
}));

const SelectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

const SelectedClassInfo = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  fontSize: "1rem"
}));

export const CourseUpdateSection = ({
  classData,
  courseData,
  itemsPerPage,
  dataLoading,
  refetchClass
}: CourseUpdateSectionProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  const [loading, setLoading] = useState<boolean>(false);

  const [courseChanges, setCourseChanges] = useState<CourseChangeMap>(new Map());
  const [selectedClass, setSelectedClass] = useState<Class>();

  const [searchState, setSearchState] = useState<SearchState>({
    teacherName: "",
    studentName: "",
    courseName: ""
  });

  const [paginationState, setPaginationState] = useState<PaginationState>({
    totalPages: 0,
    totalItems: 0,
    currentPage: 1
  });

  // Filter classes based on, (1) search criteria, and (2) active only
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

  useEffect(() => {
    setPaginationState({
      totalPages: CalculatePaginationTotalPages(filteredClasses.length, itemsPerPage),
      totalItems: filteredClasses.length,
      currentPage: 1
    });
  }, [filteredClasses, itemsPerPage]);

  const resetPagination = useCallback(() => {
    setPaginationState((prev) => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  const handleCourseChange = useCallback(
    (classId: number, newCourseId: number, newCourseName: string) => {
      setCourseChanges((prev) => {
        const newMap = new Map(prev);
        newMap.set(classId, { classId: classId, newCourseId, newCourseName });
        return newMap;
      });
      setSelectedClass(undefined);
    },
    []
  );

  const handleCourseSelection = (courseId: number) => {
    if (selectedClass && courseId) {
      const course = courseData.find((c) => c.courseId === courseId);
      if (course) {
        handleCourseChange(selectedClass.classId, courseId, getCourseName(course));
      }
    }
  };

  const handleCourseRemove = useCallback((classId: number) => {
    setCourseChanges((prev) => {
      if (Array.from(prev.keys()).find((val) => val === classId) != -1) {
        const newMap = new Map(prev);
        newMap.delete(classId);
        return newMap;
      }
      return prev;
    });
  }, []);

  const clearChanges = useCallback(() => {
    setCourseChanges(new Map());
  }, []);

  const handleSubmit = useCallback(async () => {
    if (courseChanges.size === 0) {
      showSnackbar("Please add at least one course change", "error");
      return;
    }

    setLoading(true);

    // convert to EditClassCourseRequest
    const editClassCourseRequests = Array.from(courseChanges.values()).flatMap((courseChange) => {
      return [
        {
          classId: courseChange.classId,
          courseId: courseChange.newCourseId
        } as EditClassCourseRequest
      ];
    });

    const response = await API.EditClassesCourses(editClassCourseRequests);
    const parsedResponse = apiTransformer(response, true);
    if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
      return parsedResponse as FailedResponse;
    } else {
      clearChanges();
      refetchClass();
    }
    setLoading(false);
  }, [showSnackbar, courseChanges, clearChanges]);

  const getDisplayName = (cls?: Class): string => {
    if (!cls) return "No class selected";

    return getMinimalClassName(cls);
  };

  return (
    <>
      <SearchContainer>
        <TextField
          fullWidth
          placeholder="Search by teacher or student name..."
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
          placeholder="Search by teacher or student name..."
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
        <UpdateContainer>
          <SelectionContainer elevation={0}>
            <Typography variant="h6" gutterBottom>
              1. Select Class
            </Typography>
            <ClassSelectionList
              classData={filteredClasses}
              selectedClass={selectedClass}
              paginationState={paginationState}
              onClassSelect={setSelectedClass}
              onPaginationChange={(page) =>
                setPaginationState((prev) => ({ ...prev, currentPage: page }))
              }
              itemsPerPage={itemsPerPage}
            />
          </SelectionContainer>

          <SelectionContainer elevation={0}>
            <Typography variant="h6" gutterBottom>
              2. Select New Course
            </Typography>

            <SelectedClassInfo>
              {selectedClass ? getMinimalClassName(selectedClass) : "No class selected"}
              {selectedClass && (
                <Typography variant="caption" display="block" color="textSecondary">
                  Current Course: {getCourseName(selectedClass.course)}
                </Typography>
              )}
            </SelectedClassInfo>

            <FormControl fullWidth>
              <StandardSelect
                value={selectedClass?.course ?? null}
                disabled={!selectedClass}
                blurOnSelect
                options={courseData}
                isOptionEqualToValue={(option, value) => option.courseId == value.courseId}
                getOptionLabel={(option) => getCourseName(option)}
                inputProps={{ label: "Select new course...", placeholder: "(No Course)" }}
                onChange={(_e, value) => {
                  if (value) {
                    handleCourseSelection(value.courseId);
                  }
                }}
              />
            </FormControl>
          </SelectionContainer>
        </UpdateContainer>
      )}

      <CourseChangesPreview
        courseChanges={courseChanges}
        classes={classData}
        onRemoveChange={handleCourseRemove}
      />

      <SmallCancelAndSubmitButtons
        loading={loading}
        cancelButtonText="Clear Changes"
        cancelButtonDisabled={courseChanges.size === 0}
        cancelButtonOnClick={clearChanges}
        submitButtonText="Submit Changes"
        submitButtonDisabled={courseChanges.size === 0}
        submitButtonOnClick={handleSubmit}
      ></SmallCancelAndSubmitButtons>
    </>
  );
};
