import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Course, Grade, Instrument } from "@sonamusica-fe/types";
import { CourseInsertFormData, CourseUpdateFormData } from "@sonamusica-fe/types/form/admin/course";
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
        getOptionLabel: (option) => option.name
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
        getOptionLabel: (option) => option.name
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
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: [{ name: "required" }]
    }
  ];

  const defaultUpdateFields: FormFieldType<CourseUpdateFormData>[] = defaultInsertFields.filter(
    (val): val is FormFieldType<CourseUpdateFormData> =>
      val.name !== "grade" && val.name !== "instrument"
  );

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
          testIdContext: "CourseUpsert",
          cancelButtonProps: {
            onClick: onClose
          },
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
          testIdContext: "CourseUpsert",
          cancelButtonProps: {
            onClick: onClose
          },
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
