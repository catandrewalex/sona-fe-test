import { Class, Course, SearchClassConfig, Student, Teacher } from "@sonamusica-fe/types";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { ArrowBack, Visibility } from "@mui/icons-material";
import API, { useApiTransformer } from "@sonamusica-fe/api";

import SearchResult from "@sonamusica-fe/components/Search/SearchResult";
import {
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  isValidNumericString
} from "@sonamusica-fe/utils/StringUtil";
import SearchFilter from "@sonamusica-fe/components/Search/SearchFilter";
import { FailedResponse, ResponseMany } from "api";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { useRouter } from "next/router";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import AttendanceResultDetail from "@sonamusica-fe/components/Pages/Attendance/AttendanceResultDetail";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import { DeduplicateArrayOfObjects } from "@sonamusica-fe/utils/GeneralUtil";

type SearchResultAttendanceProps = {
  backButtonHandler: () => void;
};

type StudentsTeachersCourses = {
  students: Array<Student>;
  teachers: Array<Teacher>;
  courses: Array<Course>;
};

function getStudentsTeachersCoursesFromClasses(classes: Array<Class>): StudentsTeachersCourses {
  let students: Array<Student> = [];
  let teachers: Array<Teacher> = [];
  let courses: Array<Course> = [];

  classes.forEach((_class) => {
    students.push(..._class.students);
    if (_class.teacher) teachers.push(_class.teacher);
    courses.push(_class.course);
  });

  students = DeduplicateArrayOfObjects(students, "studentId");
  teachers = DeduplicateArrayOfObjects(teachers, "teacherId");
  courses = DeduplicateArrayOfObjects(courses, "courseId");

  students.sort((x, y) => (getFullNameFromStudent(x) < getFullNameFromStudent(y) ? -1 : 1));
  courses.sort((x, y) => (getCourseName(x) < getCourseName(y) ? -1 : 1));
  teachers.sort((x, y) => (getFullNameFromTeacher(x) < getFullNameFromTeacher(y) ? -1 : 1));

  return { students, teachers, courses };
}

const SearchResultAttendance = ({
  backButtonHandler
}: SearchResultAttendanceProps): JSX.Element => {
  const [displayData, setDisplayData] = useState<Array<Class>>([]);
  const [data, setData] = useState<Array<Class>>([]);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();
  const { query, push } = useRouter();
  const user = useUser((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const startLoading = useApp((state) => state.startLoading);

  useEffect(() => {
    const queryTeacher = isValidNumericString(query.teacher);
    const queryStudent = isValidNumericString(query.student);
    const queryCourse = isValidNumericString(query.course);

    if (queryTeacher || queryStudent || queryCourse) {
      const searchConfig: SearchClassConfig = {};
      if (queryTeacher) searchConfig.teacherId = parseInt(query.teacher as string);
      if (queryStudent) searchConfig.studentId = parseInt(query.student as string);
      if (queryCourse) searchConfig.courseId = parseInt(query.course as string);

      API.SearchClassByTeacherStudentCourse(searchConfig)
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Class>).results);
            setDisplayData((parsedResponse as ResponseMany<Class>).results);
          } else {
            showSnackbar("Failed to fetch classes data!", "error");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, query]);

  useEffect(() => {
    const { students, teachers, courses } = getStudentsTeachersCoursesFromClasses(data);
    setStudentData(students);
    setTeacherData(teachers);
    setCourseData(courses);
  }, [data]);

  const calculateIsViewDetailBtnDisabled = useCallback((currData: Class): boolean => {
    return currData.students.length === 0 || currData.isDeactivated;
  }, []);

  return (
    <Box sx={{ mt: 1, position: "relative" }}>
      <IconButton
        sx={{ position: "absolute", top: "10px", left: "-15px" }}
        onClick={backButtonHandler}
        color="error"
      >
        <ArrowBack />
      </IconButton>
      <SearchFilter<Class>
        data={data}
        setData={setDisplayData}
        filters={[
          {
            type: "select",
            label: "Students",
            data: studentData,
            getOptionLabel(option) {
              return getFullNameFromStudent(option);
            },
            filterHandle(data, value) {
              for (const val of value) {
                if (data.students.map((student) => student.studentId).includes(val.studentId))
                  return true;
              }
              return false;
            }
          },
          {
            type: "select",
            label: "Courses",
            data: courseData,
            getOptionLabel(option) {
              return getCourseName(option);
            },
            filterHandle(data, value) {
              for (const val of value) {
                if (val.courseId === data.course.courseId) return true;
              }
              return false;
            }
          },
          {
            type: "select",
            label: "Teachers",
            data: teacherData,
            getOptionLabel(option) {
              return getFullNameFromTeacher(option);
            },
            filterHandle(data, value) {
              for (const val of value) {
                if (val.teacherId === data.teacher?.teacherId) return true;
              }
              return false;
            }
          }
        ]}
      />
      <Divider sx={{ my: 1 }} />
      {loading ? (
        <LoaderSimple />
      ) : (
        <SearchResult
          data={displayData}
          getDataActions={(currData) => (
            <Button
              disabled={calculateIsViewDetailBtnDisabled(currData)}
              onClick={() => {
                push("/attendance/" + currData.classId);
                startLoading();
              }}
              variant="contained"
              fullWidth
              sx={{ mx: 2, mb: 1 }}
              startIcon={<Visibility />}
            >
              View Detail
            </Button>
          )}
          getDataActionsTooltip={(currData) =>
            currData.isDeactivated ? "Activate this class to modify its attendance" : ""
          }
          getDataContent={AttendanceResultDetail}
          getDataKey={(data) => data.classId}
          getDataTitle={(data) => (
            <>
              <Typography fontWeight="bold">
                {getFullNameFromTeacher(data?.teacher) || "(No Teacher)"}
              </Typography>
              <Typography fontWeight="bold">{getCourseName(data.course)}</Typography>
            </>
          )}
        />
      )}
    </Box>
  );
};
export default SearchResultAttendance;
