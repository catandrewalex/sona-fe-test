import { Cancel, Save } from "@mui/icons-material";
import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import StudentSelectorInput from "@sonamusica-fe/components/Pages/Admin/Class/StudentSelectorInput";
import { Class, Course, Student, Teacher } from "@sonamusica-fe/types";
import { ClassInsertFormData, ClassUpdateFormData } from "@sonamusica-fe/types/form/class";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminClassFormProps = {
  data: Class[];
  teacherData: Teacher[];
  studentData: Student[];
  courseData: Course[];
  setData: (newData: Class[]) => void;
  selectedData: Class | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  teacher: "teacher",
  course: "course"
};

const PageAdminClassForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open,
  teacherData,
  studentData,
  courseData
}: PageAdminClassFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultInsertFields: FormFieldType<ClassInsertFormData>[] = [
    {
      type: "select",
      name: "teacher",
      label: "Teacher",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: teacherData,
        getOptionLabel: (option) =>
          `${option.user.userDetail?.firstName} ${option.user.userDetail?.lastName || ""}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "select",
      name: "course",
      label: "Course",
      formFieldProps: { lg: 6, md: 6 },
      inputProps: { required: true },
      selectProps: {
        options: courseData,
        getOptionLabel: (option) => `${option.instrument.name} ${option.grade.name}`
      },
      validations: [{ name: "required" }]
    },
    {
      type: "custom",
      name: "students",
      label: "Student(s)",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      validations: [],
      Component: StudentSelectorInput,
      props: { options: studentData }
    },
    {
      type: "text",
      name: "transportFee",
      label: "Transport Fee",
      formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
      inputProps: {
        placeholder: "0",
        type: "number",
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>
      },
      validations: []
    }
  ];

  const defaultUpdateFields: FormFieldType<ClassUpdateFormData>[] = [
    ...defaultInsertFields,
    {
      type: "switch",
      name: "isActive",
      label: "Active?",
      formFieldProps: { lg: 4, md: 6, sx: { pt: "8px !important" } },
      validations: [{ name: "required" }]
    }
  ];

  const defaultInsertFieldValue: ClassInsertFormData = {
    course: null,
    teacher: null,
    students: [],
    transportFee: 0
  };

  const defaultUpdateFieldValue: ClassUpdateFormData = {
    ...defaultInsertFieldValue,
    isActive: true
  };
  
  const { formProperties: formPropertiesUpdate, formRenderer: formRendererUpdate } =
    useFormRenderer<ClassUpdateFormData>(
      {
        testIdContext: "ClassUpsert",
        submitContainerProps: { align: "space-between", spacing: 3 },
        cancelButtonProps: {
          startIcon: <Cancel />,
          onClick: onClose
        },
        promptCancelButtonDialog: true,
        submitButtonProps: { endIcon: <Save /> },
        fields: defaultUpdateFields,
        errorResponseMapping,
        submitHandler: async ({ course, isActive, students, teacher, transportFee }, error) => {
          if (
            error.course ||
            error.teacher ||
            error.students ||
            error.transportFee ||
            error.isActive
          )
            return Promise.reject();

          const response = await API.UpdateClass([
            {
              courseId: course?.courseId || 0,
              studentIds: students.map((student) => student.studentId),
              teacherId: teacher?.teacherId || 0,
              transportFee: transportFee,
              isDeactivated: !isActive,
              classId: selectedData?.classId || 0
            }
          ]);
          const parsedResponse = apiTransformer(response, true);
          if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
            return parsedResponse as FailedResponse;
          } else {
            const responseData = (parsedResponse as ResponseMany<Class>).results[0];
            const newData = data.map((val) => {
              if (val.classId === responseData.classId) {
                return responseData;
              }
              return val;
            });
            setData(newData);
          }
        }
      },
      defaultUpdateFieldValue
    );

  const { formRenderer: formRendererInsert } = useFormRenderer<ClassInsertFormData>(
    {
      testIdContext: "ClassUpsert",
      submitContainerProps: { align: "space-between", spacing: 3 },
      cancelButtonProps: {
        startIcon: <Cancel />,
        onClick: onClose
      },
      promptCancelButtonDialog: true,
      submitButtonProps: { endIcon: <Save /> },
      fields: defaultInsertFields,
      errorResponseMapping,
      submitHandler: async ({ course, students, teacher, transportFee }, error) => {
        if (error.course || error.teacher || error.students || error.transportFee)
          return Promise.reject();

        const response = await API.InsertClass([
          {
            courseId: course?.courseId || 0,
            studentIds: students.map((student) => student.studentId),
            teacherId: teacher?.teacherId || 0,
            transportFee: transportFee
          }
        ]);
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<Class>).results[0];
          setData([...data, responseData]);
        }
      }
    },
    defaultInsertFieldValue
  );

  useEffect(() => {
    if (selectedData) {
      formPropertiesUpdate.valueRef.current = {
        course: selectedData.course,
        teacher: selectedData.teacher || null,
        students: selectedData.students,
        transportFee: selectedData.transportFee,
        isActive: !selectedData.isDeactivated
      };
      formPropertiesUpdate.errorRef.current = {} as Record<keyof ClassUpdateFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Class
      </Typography>
      {selectedData ? formRendererUpdate() : formRendererInsert()}
    </Modal>
  );
};

export default PageAdminClassForm;
