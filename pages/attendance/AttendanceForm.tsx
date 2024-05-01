import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Attendance, Class, Teacher } from "@sonamusica-fe/types";
import {
  AddAttendanceFormData,
  AddAttendanceFormRequest,
  EditAttendanceFormData,
  EditAttendanceFormRequest
} from "@sonamusica-fe/types/form/attendance";
import { getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import moment from "moment";
import { useEffect } from "react";

type AttendanceFormProps = {
  data?: Attendance;
  classData: Class;
  teacherOptions: Teacher[];
  onSubmit: (newData: Attendance) => void;
  onClose: () => void;
  open: boolean;
};

// TODO: rename AttendanceForm (which internally utilizes modal) to AttendanceModalForm.
//   also do this on all form that internally uses modal!

const AttendanceForm = ({
  data,
  classData,
  teacherOptions,
  onSubmit,
  onClose,
  open
}: AttendanceFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultAddFieldValue = {
    date: moment(),
    usedStudentTokenQuota: 1,
    duration: classData.course.defaultDurationMinute,
    note: "",
    teacher: classData.teacher ?? null
  };

  const formFields: FormFieldType<AddAttendanceFormData>[] = [
    {
      type: "date",
      name: "date",
      label: "Date",
      formFieldProps: { lg: 6, md: 6 },
      validations: [],
      dateProps: { slotProps: { textField: { required: true } } }
    },
    {
      type: "text",
      name: "usedStudentTokenQuota",
      label: "Used Quota",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "duration",
      label: "Duration (minute)",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: {
        type: "number",
        required: true
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "note",
      label: "Notes",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: {
        type: "text",
        multiline: true
      },
      validations: []
    },
    {
      type: "select",
      name: "teacher",
      label: "Teacher",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: teacherOptions,
        getOptionLabel: (option) => getFullNameFromTeacher(option)
      },
      validations: [{ name: "required" }]
    }
  ];

  const { formRenderer, formProperties } = data
    ? useFormRenderer<EditAttendanceFormData>(
        {
          testIdContext: "AttendanceEdit",
          cancelButtonProps: {
            onClick: onClose
          },
          fields: formFields,
          submitHandler: async (
            { teacher, date, usedStudentTokenQuota, duration, note },
            error
          ) => {
            if (
              error.teacher ||
              error.date ||
              error.usedStudentTokenQuota ||
              error.duration ||
              error.note
            )
              return Promise.reject();
            const response = await API.EditAttendance(data?.attendanceId || 0, {
              date: date,
              usedStudentTokenQuota: usedStudentTokenQuota,
              duration: duration,
              note: note,
              teacherId: teacher?.teacherId || 0
            } as EditAttendanceFormRequest);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = parsedResponse as Attendance;
              onSubmit(responseData);
            }
          }
        },
        {
          date: moment(data.date),
          usedStudentTokenQuota: data.usedStudentTokenQuota,
          duration: data.duration,
          note: data.note,
          teacher: data.teacher
        }
      )
    : useFormRenderer<AddAttendanceFormData>(
        {
          testIdContext: "AttendanceAdd",
          cancelButtonProps: {
            onClick: onClose
          },
          fields: formFields,
          submitHandler: async (
            { teacher, date, usedStudentTokenQuota, duration, note },
            error
          ) => {
            if (
              error.teacher ||
              error.date ||
              error.usedStudentTokenQuota ||
              error.duration ||
              error.note
            )
              return Promise.reject();
            const response = await API.AddAttendance(classData.classId || 0, {
              date: date,
              usedStudentTokenQuota: usedStudentTokenQuota,
              duration: duration,
              note: note,
              teacherId: teacher?.teacherId || 0
            } as AddAttendanceFormRequest);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = parsedResponse as Attendance;
              onSubmit(responseData);
            }
          }
        },
        defaultAddFieldValue
      );

  useEffect(() => {
    if (data) {
      formProperties.valueRef.current = {
        date: moment(data.date),
        usedStudentTokenQuota: data.usedStudentTokenQuota,
        duration: data.duration,
        note: data.note,
        teacher: data.teacher
      };
      formProperties.errorRef.current = {} as Record<keyof EditAttendanceFormData, string>;
    } else {
      formProperties.valueRef.current = defaultAddFieldValue;
      formProperties.errorRef.current = {} as Record<keyof EditAttendanceFormData, string>;
    }
  }, [data]);

  return (
    <Modal open={open} onClose={onClose} minWidth="70vw">
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {/* TODO: fix so that the text doesn't change mid-flight while the modal close animation is still on progress */}
        {data ? "Edit" : "Add"} Attendance
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default AttendanceForm;
