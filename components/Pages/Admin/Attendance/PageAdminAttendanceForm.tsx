import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Attendance, Class, StudentLearningToken, Teacher, Student } from "@sonamusica-fe/types";
import {
  AttendanceInsertFormData,
  AttendanceUpdateFormData
} from "@sonamusica-fe/types/form/admin/attendance";
import {
  convertMomentDateToRFC3339,
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import moment from "moment";
import React, { useEffect } from "react";

type PageAdminAttendanceFormProps = {
  data: Attendance[];
  classData: Class[];
  studentLearningTokenData: StudentLearningToken[];
  teacherData: Teacher[];
  studentData: Student[];
  setData: (newData: Attendance[]) => void;
  selectedData: Attendance | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  date: "date",
  student: "studentId",
  teacher: "teacherId",
  class: "classId",
  studentLearningToken: "studentLearningTokenId"
};

const PageAdminAttendanceForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  classData,
  studentLearningTokenData,
  teacherData,
  studentData
}: PageAdminAttendanceFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultFields: FormFieldType<AttendanceInsertFormData>[] = [
    {
      type: "select",
      name: "student",
      label: "Student",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: studentData,
        getOptionLabel: (option) => `${getFullNameFromStudent(option)}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "teacher",
      label: "Teacher",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: teacherData,
        getOptionLabel: (option) => `${getFullNameFromTeacher(option)}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "class",
      label: "Class",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: { required: true },
      selectProps: {
        options: classData,
        getOptionLabel: (option) =>
          `${getCourseName(option.course)} by ${getFullNameFromTeacher(option.teacher)}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "studentLearningToken",
      label: "Student Learning Token",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: { required: true },
      selectProps: {
        options: studentLearningTokenData,
        getOptionLabel: (option) =>
          `Fee: ${convertNumberToCurrencyString(
            option.courseFeeValue
          )} | Transport: ${convertNumberToCurrencyString(option.transportFeeValue)}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "usedStudentTokenQuota",
      label: "Quota Used",
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number"
      },
      validations: []
    },
    {
      type: "text",
      name: "duration",
      label: "Duration (minute)",
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number"
      },
      validations: []
    },
    {
      type: "date",
      name: "date",
      label: "Date",
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
      validations: [],
      dateProps: { defaultValue: selectedData ? moment(selectedData.date) : moment() }
    },
    {
      type: "text",
      name: "note",
      label: "Notes",
      formFieldProps: { lg: 12, md: 12, sx: { pt: "8px !important" } },
      inputProps: {
        type: "text",
        multiline: true
      },
      validations: []
    }
  ];

  const defaultFieldValue: AttendanceUpdateFormData = {
    class: null,
    teacher: null,
    student: null,
    studentLearningToken: null,
    usedStudentTokenQuota: 1,
    duration: 30,
    note: "",
    date: moment()
  };

  const { formProperties, formRenderer } = selectedData
    ? useFormRenderer<AttendanceUpdateFormData>(
        {
          testIdContext: "AttendanceUpsert",
          cancelButtonProps: {
            onClick: onClose
          },
          fields: defaultFields,
          submitHandler: async (
            {
              student,
              teacher,
              studentLearningToken,
              usedStudentTokenQuota,
              date,
              note,
              duration,
              class: classData
            },
            error
          ) => {
            if (
              error.class ||
              error.student ||
              error.teacher ||
              error.studentLearningToken ||
              error.usedStudentTokenQuota ||
              error.date ||
              error.duration ||
              error.note
            )
              return Promise.reject();

            const response = await API.UpdateAttendance([
              {
                attendanceId: selectedData?.attendanceId || 0,
                usedStudentTokenQuota,
                date: convertMomentDateToRFC3339(date),
                note,
                duration,
                classId: classData?.classId || 0,
                studentId: student?.studentId || 0,
                teacherId: teacher?.teacherId || 0,
                studentLearningTokenId: studentLearningToken?.studentLearningTokenId || 0
              }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<Attendance>).results[0];
              const newData = data.map((val) => {
                if (val.attendanceId === responseData.attendanceId) {
                  return responseData;
                }
                return val;
              });
              setData(newData);
            }
          }
        },
        defaultFieldValue
      )
    : useFormRenderer<AttendanceInsertFormData>(
        {
          testIdContext: "AttendanceUpsert",
          cancelButtonProps: {
            onClick: onClose
          },
          fields: defaultFields,
          errorResponseMapping,
          submitHandler: async (
            {
              class: classData,
              student,
              teacher,
              studentLearningToken,
              usedStudentTokenQuota,
              date,
              note,
              duration
            },
            error
          ) => {
            if (
              error.class ||
              error.student ||
              error.teacher ||
              error.studentLearningToken ||
              error.usedStudentTokenQuota ||
              error.date ||
              error.duration ||
              error.note
            )
              return Promise.reject();
            const response = await API.InsertAttendance([
              {
                usedStudentTokenQuota,
                date: convertMomentDateToRFC3339(date),
                note,
                duration,
                classId: classData?.classId || 0,
                studentId: student?.studentId || 0,
                teacherId: teacher?.teacherId || 0,
                studentLearningTokenId: studentLearningToken?.studentLearningTokenId || 0
              }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<Attendance>).results[0];
              setData([...data, responseData]);
            }
          }
        },
        defaultFieldValue
      );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        usedStudentTokenQuota: selectedData.usedStudentTokenQuota,
        duration: selectedData.duration,
        note: selectedData.note,
        date: moment(selectedData.date),
        teacher: selectedData.teacher,
        student: selectedData.student,
        class: selectedData.class,
        studentLearningToken: selectedData.studentLearningToken
      };
      formProperties.errorRef.current = {} as Record<keyof AttendanceUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Attendance
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminAttendanceForm;
