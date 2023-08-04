import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer, {
  FormField as FormFieldType
} from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { Instrument } from "@sonamusica-fe/types";
import { InstrumentUpsertFormData } from "@sonamusica-fe/types/form/instrument";
import { FailedResponse, ResponseMany } from "api";
import React, { useEffect } from "react";

type PageAdminInstrumentFormProps = {
  data: Instrument[];
  setData: (newData: Instrument[]) => void;
  selectedData: Instrument | undefined;
  onClose: () => void;
  open: boolean;
};

const errorResponseMapping = {
  name: "name"
};

const defaultFields: FormFieldType<InstrumentUpsertFormData>[] = [
  {
    type: "text",
    name: "name",
    label: "Name",
    formFieldProps: { lg: 12, md: 12 },
    inputProps: { testIdContext: "InstrumentUpsertName", type: "text" },
    validations: [{ name: "required" }]
  }
];

const PageAdminInstrumentForm = ({
  data,
  setData,
  selectedData,
  onClose,
  open
}: PageAdminInstrumentFormProps): JSX.Element => {
  const apiTransformer = useApiTransformer();

  const defaultFieldValue: InstrumentUpsertFormData = {
    name: ""
  };

  const { formProperties, formRenderer } = useFormRenderer<InstrumentUpsertFormData>(
    {
      submitContainerProps: { align: "space-between", spacing: 3 },
      cancelButtonProps: {
        testIdContext: "InstrumentUpsertCancel",
        startIcon: <Cancel />,
        onClick: onClose
      },
      promptCancelButtonDialog: true,
      submitButtonProps: { endIcon: <Save />, testIdContext: "InstrumentUpsertSubmit" },
      fields: defaultFields,
      errorResponseMapping,
      submitHandler: async (formData, error) => {
        if (error.name) return Promise.reject();

        let request;

        if (selectedData) {
          request = API.UpdateInstrument([{ ...selectedData, name: formData.name }]);
        } else {
          request = API.InsertInstrument([{ name: formData.name }]);
        }

        const response = await request;
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<Instrument>).results[0];
          if (selectedData) {
            const newData = data.map((val) => {
              if (val.instrumentId === responseData.instrumentId) {
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
      formProperties.errorRef.current = {} as Record<keyof InstrumentUpsertFormData, string>;
    }
  }, [selectedData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        {selectedData ? "Update" : "Add"} Instrument
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default PageAdminInstrumentForm;
