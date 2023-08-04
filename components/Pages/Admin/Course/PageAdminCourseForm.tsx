import { Cancel, Save } from "@mui/icons-material";
import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Course, Grade, Instrument } from "@sonamusica-fe/types";
import { CourseInsertFormData, CourseUpdateFormData } from "@sonamusica-fe/types/form/course";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminCourseFormProps = {
  data: Course[];
  gradeData: Grade[];
  instrumentData: Instrument[];
  setData: (newData: Course[]) => void;
  selectedData: Course | undefined;
  onClose: () => void;
  open: boolean;
};

const PageAdminCourseForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  instrumentData,
  gradeData
}: PageAdminCourseFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultInsertFields: FormFieldType<CourseInsertFormData>[] = [
    {
      type: "select",
      name: "grade",
      label: "Grade",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: gradeData,
        getOptionLabel: (option) => option.name,
        testIdContext: "CourseUpsertGrade"
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "instrument",
      label: "Instrument",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: instrumentData,
        getOptionLabel: (option) => option.name,
        testIdContext: "CourseUpsertInstrument"
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "defaultDurationMinute",
      label: "Course Duration",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        testIdContext: "CourseUpsertDuration",
        type: "number",
        endAdornment: <InputAdornment position="end">minute(s)</InputAdornment>
      },
      validations: [{ name: "required" }]
    },
    {
      type: "text",
      name: "defaultFee",
      label: "Course Fee",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        required: true,
        testIdContext: "CourseUpsertFee",
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }]
    }
  ];

  const defaultUpdateFields: FormFieldType<CourseUpdateFormData>[] = defaultInsertFields.filter(
    (val) => val.name !== "grade" && val.name !== "instrument"
  ) as FormFieldType<CourseUpdateFormData>[];

  const defaultUpdateFieldValue: CourseUpdateFormData = {
    defaultDurationMinute: 0,
    defaultFee: 0
  };

  const defaultInsertFieldValue: CourseInsertFormData = {
    ...defaultUpdateFieldValue,
    grade: null,
    instrument: null
  };

  const { formProperties, formRenderer } = selectedData
    ? useFormRenderer<CourseUpdateFormData>(
        {
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            testIdContext: "CourseUpsertCancel",
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save />, testIdContext: "CourseUpsertSubmit" },
          fields: defaultUpdateFields,
          errorResponseMapping: {
            defaultDurationMinute: "defaultDurationMinute",
            defaultFee: "defaultFee"
          },
          submitHandler: async ({ defaultDurationMinute, defaultFee }, error) => {
            if (error.defaultDurationMinute || error.defaultFee) return Promise.reject();
            const response = await API.UpdateCourse([
              { courseId: selectedData.courseId, defaultFee, defaultDurationMinute }
            ]);
            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<Course>).results[0];
              const newData = data.map((val) => {
                if (val.courseId === responseData.courseId) {
                  return responseData;
                }
                return val;
              });
              setData(newData);
            }
          }
        },
        defaultUpdateFieldValue
      )
    : useFormRenderer<CourseInsertFormData>(
        {
          submitContainerProps: { align: "space-between", spacing: 3 },
          cancelButtonProps: {
            testIdContext: "CourseUpsertCancel",
            startIcon: <Cancel />,
            onClick: onClose
          },
          promptCancelButtonDialog: true,
          submitButtonProps: { endIcon: <Save />, testIdContext: "CourseUpsertSubmit" },
          fields: defaultInsertFields,
          errorResponseMapping: {
            defaultDurationMinute: "defaultDurationMinute",
            defaultFee: "defaultFee",
            grade: "gradeId",
            instrument: "instrumentId"
          },
          submitHandler: async (
            { defaultDurationMinute, defaultFee, grade, instrument },
            error
          ) => {
            if (error.defaultDurationMinute || error.defaultFee || error.grade || error.instrument)
              return Promise.reject();
            const response = await API.InsertCourse([
              {
                defaultDurationMinute,
                defaultFee,
                gradeId: grade?.gradeId || 0,
                instrumentId: instrument?.instrumentId || 0
              }
            ]);

            const parsedResponse = apiTransformer(response, true);
            if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
              return parsedResponse as FailedResponse;
            } else {
              const responseData = (parsedResponse as ResponseMany<Course>).results[0];
              setData([...data, responseData]);
            }
          }
        },
        defaultInsertFieldValue
      );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        defaultDurationMinute: selectedData.defaultDurationMinute,
        defaultFee: selectedData.defaultFee
      };
      formProperties.errorRef.current = {} as Record<keyof CourseUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Course
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminCourseForm;
