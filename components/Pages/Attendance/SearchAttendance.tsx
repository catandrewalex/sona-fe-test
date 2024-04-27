import { Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Course, Attendance, Student, Teacher } from "@sonamusica-fe/types";
import {
  convertMomentDateToRFC3339,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";

const SearchAttendance = (): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const user = useUser((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);

  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [courseData, setCourse] = useState<Course[]>([]);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { showSnackbar } = useSnack();

  const { push } = useRouter();

  useEffect(() => {
    if (user) {
      const promises = [
        API.GetStudentDropdownOptions(),
        API.GetTeacherDropdownOptions(),
        API.GetAllCourse()
      ];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Student>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentData((parsedResponse as ResponseMany<Student>).results);
          }
        } else {
          showSnackbar("Failed to fetch students data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Course>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setCourse((parsedResponse as ResponseMany<Course>).results);
          }
        } else {
          showSnackbar("Failed to fetch course data!", "error");
        }

        setLoading(false);
      });
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh"
      }}
    >
      <Card sx={{ height: "fit-content", width: "450px", p: 2 }} elevation={3}>
        <CardContent>
          {loading ? (
            <LoaderSimple />
          ) : (
            <>
              <Typography variant="h5" align="center" sx={{ mb: 5 }}>
                Search Attendance
              </Typography>
              <StandardSelect
                options={teacherData}
                getOptionLabel={getFullNameFromTeacher}
                inputProps={{
                  label: "Teacher",
                  error: teacher === null && student === null && selectedCourse === null
                }}
                value={teacher}
                onChange={(_e, value) => {
                  setTeacher(value);
                }}
              />
              <StandardSelect
                options={studentData}
                getOptionLabel={getFullNameFromStudent}
                inputProps={{
                  label: "Student",
                  error: teacher === null && student === null && selectedCourse === null
                }}
                value={student}
                onChange={(_e, value) => {
                  setStudent(value);
                }}
              />
              <StandardSelect
                options={courseData}
                getOptionLabel={getCourseName}
                inputProps={{
                  label: "Course",
                  error: teacher === null && student === null && selectedCourse === null
                }}
                value={selectedCourse}
                onChange={(_e, value) => {
                  setSelectedCourse(value);
                }}
              />
              {teacher === null && student === null && selectedCourse === null && (
                <Typography variant="subtitle2" color="error" sx={{ my: 1 }} textAlign="center">
                  At least one of the fields is required
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                disabled={teacher === null && student === null && selectedCourse === null}
                startIcon={<Search />}
                onClick={() => {
                  const queryObj: ParsedUrlQueryInput = {};
                  if (teacher) queryObj.teacher = teacher.teacherId;
                  if (student) queryObj.student = student.studentId;
                  if (selectedCourse) queryObj.course = selectedCourse.courseId;
                  push({ pathname: "/attendance", query: queryObj });
                }}
              >
                Search
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchAttendance;
