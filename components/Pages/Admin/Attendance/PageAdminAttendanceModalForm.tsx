import { Typography } from "@mui/material";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
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
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  getFullStudentLearningTokenName
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

const PageAdminAttendanceModalForm = ({
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
      formFieldProps: { lg: 6 },
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
      formFieldProps: { lg: 6, sx: { pt: { xs: "8px !important", sm: "24px !important" } } }, // on "xs", this field is no longer the top-most row, so we need to use the same "pt" as other fields.
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
      formFieldProps: { lg: 6, sx: { pt: "8px !important" } },
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
      formFieldProps: { lg: 6, sx: { pt: "8px !important" } },
      inputProps: { required: true },
      selectProps: {
        options: studentLearningTokenData,
        getOptionLabel: (option) => getFullStudentLearningTokenName(option)
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "usedStudentTokenQuota",
      label: "Quota Used",
      formFieldProps: { lg: 4, md: 4, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "duration",
      label: "Duration (minute)",
      formFieldProps: { lg: 4, md: 4, sx: { pt: "8px !important" } },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }, { name: "gt-zero" }]
    },
    {
      type: "date-time",
      name: "date",
      label: "Date",
      formFieldProps: { lg: 4, md: 4, sx: { pt: "8px !important" } },
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
    },
    {
      type: "switch",
      name: "isPaid",
      label: "Is Paid",
      formFieldProps: { lg: 12, md: 12, sx: { pt: "8px !important" } },
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
    date: moment(),
    isPaid: false
  };

  const { formProperties: updateFormProperties, formRenderer: updateFormRenderer } =
    useFormRenderer<AttendanceUpdateFormData>(
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
            isPaid,
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
            error.note ||
            error.isPaid
          )
            return Promise.reject();

          const response = await ADMIN_API.UpdateAttendance([
            {
              attendanceId: selectedData?.attendanceId || 0,
              usedStudentTokenQuota,
              date: convertMomentDateToRFC3339(date),
              note,
              duration,
              isPaid: isPaid,
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
    );

  const { formRenderer: insertFormRenderer } = useFormRenderer<AttendanceInsertFormData>(
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
          duration,
          isPaid
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
          error.note ||
          error.duration ||
          error.isPaid
        )
          return Promise.reject();
        const response = await ADMIN_API.InsertAttendance([
          {
            usedStudentTokenQuota,
            date: convertMomentDateToRFC3339(date),
            note,
            duration,
            isPaid: isPaid,
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
      updateFormProperties.valueRef.current = {
        usedStudentTokenQuota: selectedData.usedStudentTokenQuota,
        duration: selectedData.duration,
        isPaid: selectedData.isPaid,
        note: selectedData.note,
        date: moment(selectedData.date),
        teacher: selectedData.teacher,
        student: selectedData.student,
        class: selectedData.class,
        studentLearningToken: selectedData.studentLearningToken
      };
      updateFormProperties.errorRef.current = {} as Record<keyof AttendanceUpdateFormData, string>;
    }
  }, [selectedData, updateFormProperties.errorRef, updateFormProperties.valueRef]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Attendance
      </Typography>
      {selectedData ? updateFormRenderer() : insertFormRenderer()}
    </Modal>
  );
};

export default PageAdminAttendanceModalForm;
