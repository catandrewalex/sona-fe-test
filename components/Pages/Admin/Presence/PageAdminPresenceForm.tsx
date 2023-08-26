import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Presence, Class, StudentLearningToken, Teacher, Student } from "@sonamusica-fe/types";
import {
  PresenceInsertFormData,
  PresenceUpdateFormData
} from "@sonamusica-fe/types/form/admin/presence";
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

type PageAdminPresenceFormProps = {
  data: Presence[];
  classData: Class[];
  studentLearningTokenData: StudentLearningToken[];
  teacherData: Teacher[];
  studentData: Student[];
  setData: (newData: Presence[]) => void;
  selectedData: Presence | undefined;
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

const PageAdminPresenceForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  classData,
  studentLearningTokenData,
  teacherData,
  studentData
}: PageAdminPresenceFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultFields: FormFieldType<PresenceInsertFormData>[] = [
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

  const defaultFieldValue: PresenceUpdateFormData = {
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
    ? useFormRenderer<PresenceUpdateFormData>(
        {
          testIdContext: "PresenceUpsert",
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

            const response = await API.UpdatePresence([
              {
                presenceId: selectedData?.presenceId || 0,
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
              const responseData = (parsedResponse as ResponseMany<Presence>).results[0];
              const newData = data.map((val) => {
                if (val.presenceId === responseData.presenceId) {
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
    : useFormRenderer<PresenceInsertFormData>(
        {
          testIdContext: "PresenceUpsert",
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
            const response = await API.InsertPresence([
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
              const responseData = (parsedResponse as ResponseMany<Presence>).results[0];
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
      formProperties.errorRef.current = {} as Record<keyof PresenceUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Presence
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminPresenceForm;
