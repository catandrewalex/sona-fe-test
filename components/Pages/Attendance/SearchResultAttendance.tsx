import {
  Class,
  Course,
  Attendance,
  SearchClassConfig,
  Student,
  Teacher
} from "@sonamusica-fe/types";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { Add, ArrowBack, Details, Visibility } from "@mui/icons-material";
import API, { useApiTransformer } from "@sonamusica-fe/api";

import SearchResult from "@sonamusica-fe/components/Search/SearchResult";
import {
  advancedNumberFilter,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  isValidNumericString
} from "@sonamusica-fe/utils/StringUtil";
import SearchFilter from "@sonamusica-fe/components/Search/SearchFilter";
import { SuccessResponse, FailedResponse, ResponseMany } from "api";
import moment from "moment";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import PaymentDetail from "@sonamusica-fe/components/Pages/Payment/PaymentDetail";
import PaymentDetailAction from "@sonamusica-fe/components/Pages/Payment/PaymentDetailAction";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { useRouter } from "next/router";
import EditPaymentForm from "@sonamusica-fe/components/Pages/Payment/EditPaymentForm";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import AttendanceResultDetail from "@sonamusica-fe/components/Pages/Attendance/AttendanceResultDetail";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";

type SearchResultAttendanceProps = {
  backButtonHandler: () => void;
};

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

      const promises = [
        API.SearchClassByTeacherStudentCourse(searchConfig),
        API.GetStudentDropdownOptions(),
        API.GetTeacherDropdownOptions(),
        API.GetCourseDropdownOptions()
      ];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Class>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Class>).results);
            setDisplayData((parsedResponse as ResponseMany<Class>).results);
          }
        } else {
          showSnackbar("Failed to fetch students data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Student>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentData((parsedResponse as ResponseMany<Student>).results);
          }
        } else {
          showSnackbar("Failed to fetch students data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }
        if (value[3].status === "fulfilled") {
          const response = value[3].value as SuccessResponse<Course>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setCourseData((parsedResponse as ResponseMany<Course>).results);
          }
        } else {
          showSnackbar("Failed to fetch courses data!", "error");
        }
        setLoading(false);
      });
    }
  }, [user, query]);

  return (
    <Box sx={{ mt: 1, position: "relative" }}>
      <IconButton
        sx={{ position: "absolute", top: "10px", left: "-25px" }}
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
                if (data.students.map((student) => student.studentId).includes(val)) return true;
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
