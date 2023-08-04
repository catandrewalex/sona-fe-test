import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Grade } from "@sonamusica-fe/types";
import { GradeUpsertFormData } from "@sonamusica-fe/types/form/grade";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminGradeFormProps = {
  data: Grade[];
  setData: (newData: Grade[]) => void;
  selectedData: Grade | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  name: "name"
};

const defaultFields: FormFieldType<GradeUpsertFormData>[] = [
  {
    type: "text",
    name: "name",
    label: "Name",
    formFieldProps: { lg: 12, md: 12 },
    inputProps: { testIdContext: "GradeUpsertName", type: "text" },
    validations: [{ name: "required" }]
  }
];

const PageAdminGradeForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open
}: PageAdminGradeFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultFieldValue: GradeUpsertFormData = {
    name: ""
  };

  const { formProperties, formRenderer } = useFormRenderer<GradeUpsertFormData>(
    {
      submitContainerProps: { align: "space-between", spacing: 3 },
      cancelButtonProps: {
        testIdContext: "GradeUpsertCancel",
        startIcon: <Cancel />,
        onClick: onClose
      },
      promptCancelButtonDialog: true,
      submitButtonProps: { endIcon: <Save />, testIdContext: "GradeUpsertSubmit" },
      fields: defaultFields,
      errorResponseMapping,
      submitHandler: async (formData, error) => {
        if (error.name) return Promise.reject();

        let request;

        if (selectedData) {
          request = API.UpdateGrade([{ ...selectedData, name: formData.name }]);
        } else {
          request = API.InsertGrade([{ name: formData.name }]);
        }

        const response = await request;
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<Grade>).results[0];
          if (selectedData) {
            const newData = data.map((val) => {
              if (val.gradeId === responseData.gradeId) {
                return responseData;
              }
              return val;
            });
            setData(newData);
          } else {
            setData([...data, responseData]);
          }
        }
      }
    },
    defaultFieldValue
  );

  useEffect(() => {
    if (selectedData) {
      formProperties.valueRef.current = {
        name: selectedData.name
      };
      formProperties.errorRef.current = {} as Record<keyof GradeUpsertFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Grade
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminGradeForm;
