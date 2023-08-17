import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import { EnrollmentPaymentUpdateFormData } from "@sonamusica-fe/types/form/admin/enrollment-payment";
import { EditPaymentBalanceFormData } from "@sonamusica-fe/types/form/payment";
import { convertMomentDateToRFC3339 } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

type EditPaymentFormProps = {
  data?: EnrollmentPayment;
  onSubmit: (newData: EnrollmentPayment) => void;
};

const EditPaymentForm = ({ data, onSubmit }: EditPaymentFormProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const onClose = useCallback(() => setOpen(false), []);
  const apiTransformer = useApiTransformer();

  const { formRenderer, formProperties } = useFormRenderer<EditPaymentBalanceFormData>(
    {
      testIdContext: "EnrollmentPaymentUpsert",
      submitContainerProps: { align: "space-between", spacing: 3 },
      cancelButtonProps: {
        startIcon: <Cancel />,
        onClick: onClose
      },
      promptCancelButtonDialog: true,
      submitButtonProps: { endIcon: <Save /> },
      fields: [
        {
          type: "text",
          name: "balanceTopUp",
          label: "Balance Top Up",
          formFieldProps: { lg: 6, md: 6 },
          inputProps: {
            type: "number",
            required: true
          },
          validations: [{ name: "required" }]
        },
        {
          type: "date",
          name: "paymentDate",
          label: "Payment Date",
          formFieldProps: { lg: 6, md: 6 },
          validations: [],
          dateProps: { slotProps: { textField: { required: true } } }
        }
      ],
      submitHandler: async ({ balanceTopUp, paymentDate }, error) => {
        if (error.balanceTopUp || error.paymentDate) return Promise.reject();
        const response = await API.EditPaymentTopUpBalance({
          balanceTopUp,
          paymentDate: convertMomentDateToRFC3339(paymentDate),
          enrollmentPaymentId: data?.enrollmentPaymentId || 0
        });
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = (parsedResponse as ResponseMany<EnrollmentPayment>).results[0];
          onSubmit(responseData);
        }
      }
    },
    { paymentDate: moment(), balanceTopUp: 0 }
  );

  useEffect(() => {
    if (data) {
      setOpen(true);
      formProperties.valueRef.current = {
        balanceTopUp: data.balanceTopUp,
        paymentDate: moment(data.paymentDate)
      };
      formProperties.errorRef.current = {} as Record<keyof EditPaymentBalanceFormData, string>;
    }
  }, [data]);

  return (
    <Modal open={open} onClose={onClose} minWidth="70vh">
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        Edit Payment
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default EditPaymentForm;
