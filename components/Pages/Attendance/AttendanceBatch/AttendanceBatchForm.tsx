import React, { useState, useCallback, useMemo } from "react";
import { InputAdornment, Box } from "@mui/material";
import { Class, Teacher } from "@sonamusica-fe/types";
import { AddAttendanceBatchFormData } from "@sonamusica-fe/types/form/attendance";
import useFormRenderer, {
  FormField as FormFieldType,
  FormSpacingType
} from "@sonamusica-fe/components/Form/FormRenderer";
import { getFullNameFromTeacher, getFullClassName } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import { cloneDeep } from "lodash";

interface AttendanceBatchFormProps {
  classData: Class[];
  teacherData: Teacher[];
  onAddAttendanceBatchFormData: (attendanceBatchFormData: AddAttendanceBatchFormData) => void;
}

const AttendanceBatchForm = ({
  classData,
  teacherData,
  onAddAttendanceBatchFormData
}: AttendanceBatchFormProps): JSX.Element => {
  const [selectedClass, setSelectedClass] = useState<Class>();

  const onAdd = useCallback(
    (formData: AddAttendanceBatchFormData) => {
      onAddAttendanceBatchFormData(formData);
    },
    [onAddAttendanceBatchFormData]
  );

  const defaultFieldValue = useMemo(
    () => ({
      class: null,
      date: moment(),
      usedStudentTokenQuota: 1,
      duration: 30,
      note: "",
      teacher: null
    }),
    []
  );

  const errorResponseMapping = useMemo(
    () => ({
      class: "class",
      date: "date",
      usedStudentTokenQuota: "usedStudentTokenQuota",
      duration: "duration",
      teacher: "teacher"
    }),
    []
  );

  const insertFields: FormFieldType<AddAttendanceBatchFormData>[] = [
    {
      type: "select",
      name: "class",
      label: "Class",
      formFieldProps: { lg: 12, md: 12, sm: 12, xs: 12 },
      validations: [{ name: "required" }],
      selectProps: {
        options: classData,
        getOptionLabel: (option) => getFullClassName(option),
        isOptionEqualToValue: (option, value) => option?.classId === value?.classId,
        onChange: (valueRef, errorRef, _e, value) => {
          setSelectedClass(value);
          if (value) {
            valueRef.current.class = value;
            valueRef.current.teacher = value.teacher;
          } else {
            valueRef.current.class = null;
            valueRef.current.teacher = null;
          }

          errorRef.current = {
            class: "",
            date: "",
            usedStudentTokenQuota: "",
            duration: "",
            note: "",
            teacher: ""
          };
        }
      }
    },
    {
      type: "date-time",
      name: "date",
      label: "Date",
      formFieldProps: { lg: 6, md: 6, xs: 12 },
      validations: [],
      dateProps: { slotProps: { textField: { required: true } } }
    },
    {
      type: "text",
      name: "usedStudentTokenQuota",
      label: "Used Quota",
      formFieldProps: { lg: 6, md: 6, xs: 12 },
      inputProps: {
        type: "number",
        required: true,
        disabled: !selectedClass
      },
      validations: [{ name: "required" }, { name: "gte-zero" }]
    },
    {
      type: "text",
      name: "duration",
      label: "Duration",
      formFieldProps: { lg: 6, md: 6, xs: 12 },
      inputProps: {
        type: "number",
        required: true,
        disabled: !selectedClass,
        endAdornment: <InputAdornment position="end">minute(s)</InputAdornment>
      },
      validations: [{ name: "required" }, { name: "gt-zero" }]
    },
    {
      type: "select",
      name: "teacher",
      label: "Teacher",
      formFieldProps: { lg: 6, md: 6, xs: 12 },
      inputProps: { required: true, disabled: !selectedClass },
      selectProps: {
        options: teacherData,
        getOptionLabel: (option) => getFullNameFromTeacher(option)
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "note",
      label: "Notes",
      formFieldProps: { lg: 12, md: 6, xs: 12 },
      inputProps: {
        type: "text",
        multiline: true,
        disabled: !selectedClass
      },
      validations: []
    }
  ];

  const { formRenderer } = useFormRenderer<AddAttendanceBatchFormData>(
    {
      testIdContext: "AttendanceBatchInsert",
      fields: insertFields,
      disableUseOfDefaultFormConfig: true,
      disablePromptCancelButtonDialog: true,
      disableLoading: true,
      formSpacing: FormSpacingType.COMPACT,
      submitContainerProps: {
        spacing: 1
      },
      submitButtonProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 3,
        xl: 3,
        submitText: "Add to Batch",
        testIdContext: "AttendanceBatch-Add"
      },
      errorResponseMapping,
      submitHandler: async (formData, error) => {
        if (
          error.class ||
          error.date ||
          error.usedStudentTokenQuota ||
          error.duration ||
          error.note ||
          error.teacher
        )
          return Promise.reject();

        onAdd(cloneDeep(formData));
      }
    },
    defaultFieldValue
  );

  return <Box sx={{ marginBottom: "32px" }}>{formRenderer()}</Box>;
};

export const MemoizedAttendanceBatchForm = React.memo(AttendanceBatchForm);
