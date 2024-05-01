import { Box, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Class, Student, StudentEnrollment } from "@sonamusica-fe/types";
import { useDebouncedCallback } from "@sonamusica-fe/utils/LodashUtil";
import {
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import React, { useEffect, useState } from "react";

type NewPaymentStepOneProps = {
  setStudentEnrollment: (data?: StudentEnrollment) => void;
  defaultStudent?: Student;
  defaultClass?: Class;
};

const NewPaymentStepOne = ({
  setStudentEnrollment,
  defaultClass,
  defaultStudent
}: NewPaymentStepOneProps): JSX.Element => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [filteredClassData, setFilteredClassData] = useState<Class[]>([]);
  const [studentEnrollmentData, setStudentEnrollmentData] = useState<StudentEnrollment[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(defaultStudent || null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(defaultClass || null);
  const [selectLoading, setSelectLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  useEffect(() => {
    if (user) {
      const promises = [API.GetStudentDropdownOptions(), API.GetStudentEnrollmentDropdownOptions()];
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
          const response = value[1].value as SuccessResponse<StudentEnrollment>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentEnrollmentData((parsedResponse as ResponseMany<StudentEnrollment>).results);
          }
        } else {
          showSnackbar("Failed to fetch courses data!", "error");
        }

        setLoading(false);
      });
    }
  }, [user]);

  const studentSearchHandler = useDebouncedCallback((student: Student) => {
    const filteredStudentEnrollment = studentEnrollmentData.filter(
      (data) => data.student.studentId === student.studentId
    );
    setFilteredClassData(filteredStudentEnrollment.map((data) => data.class));
    setSelectLoading(false);
  }, 750);

  const classSearchHandler = useDebouncedCallback((cl: Class) => {
    const filteredStudentEnrollment = studentEnrollmentData.filter(
      (data) =>
        data.student.studentId === selectedStudent?.studentId && data.class.classId === cl.classId
    );
    if (filteredStudentEnrollment.length > 0) {
      setStudentEnrollment(filteredStudentEnrollment[0]);
      setError("");
    } else {
      setError("Student Enrollment not found!");
    }
  }, 750);

  if (loading) return <LoaderSimple />;

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Box display="flex" flexDirection="column" px={5}>
        <StandardSelect
          sx={{ mx: 1 }}
          value={selectedStudent}
          options={studentData}
          getOptionLabel={(option) => getFullNameFromStudent(option)}
          inputProps={{ label: "Select Student" }}
          onChange={(e, value) => {
            setSelectedStudent(value);
            if (value) {
              setSelectLoading(true);
              studentSearchHandler(value);
            } else {
              setStudentEnrollment(undefined);
              setSelectedClass(null);
            }
          }}
          fullWidth
        />
        <StandardSelect
          disabled={selectedStudent === null || selectLoading}
          sx={{ mx: 1 }}
          value={selectedClass}
          options={filteredClassData}
          loading={selectLoading}
          getOptionLabel={(option) =>
            `${getCourseName(option.course)}${
              option.teacher ? " by " : " (No Teacher)"
            }${getFullNameFromTeacher(option.teacher)}`
          }
          inputProps={{ label: "Select Class" }}
          onChange={(e, value) => {
            setSelectedClass(value);
            if (value) {
              classSearchHandler(value);
            } else {
              setStudentEnrollment(undefined);
            }
          }}
          fullWidth
        />
      </Box>
      {error !== "" && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default NewPaymentStepOne;
