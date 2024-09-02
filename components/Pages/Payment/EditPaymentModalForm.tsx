import { InputAdornment, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import Modal from "@sonamusica-fe/components/Modal";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import { EditPaymentSafeAttributesFormData } from "@sonamusica-fe/types/form/payment";
import { convertMomentDateToRFC3339 } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

type EditPaymentFormProps = {
  data?: EnrollmentPayment;
  onSubmit: (newData: EnrollmentPayment) => void;
  onClose: () => void;
};

const EditPaymentModalForm = ({ data, onSubmit, onClose }: EditPaymentFormProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const onCloseInternal = useCallback(() => {
    setOpen(false);
    onClose();
  }, [onClose]);
  const apiTransformer = useApiTransformer();

  const { formRenderer, formProperties } = useFormRenderer<EditPaymentSafeAttributesFormData>(
    {
      testIdContext: "EnrollmentPaymentUpsert",
      cancelButtonProps: {
        onClick: onCloseInternal
      },

      fields: [
        {
          type: "text",
          name: "balanceBonus",
          label: "Balance Bonus",
          formFieldProps: { lg: 6, md: 6 },
          inputProps: {
            type: "number",
            required: true
          },
          validations: [{ name: "required" }]
        },
        {
          type: "text",
          name: "discountFeeValue",
          label: "Discount Fee",
          formFieldProps: { lg: 6, md: 6 },
          inputProps: {
            type: "number",
            required: true,
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>
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
      submitHandler: async ({ balanceBonus, discountFeeValue, paymentDate }, error) => {
        if (error.balanceBonus || error.paymentDate) return Promise.reject();
        const response = await API.EditPaymentBalanceBonus({
          balanceBonus,
          discountFeeValue,
          paymentDate: convertMomentDateToRFC3339(paymentDate),
          enrollmentPaymentId: data?.enrollmentPaymentId || 0
        });
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          const responseData = parsedResponse as EnrollmentPayment;
          onSubmit(responseData);
        }
      }
    },
    { paymentDate: moment(), balanceBonus: 0, discountFeeValue: 0 }
  );

  useEffect(() => {
    if (data) {
      setOpen(true);
      formProperties.valueRef.current = {
        balanceBonus: data.balanceBonus,
        discountFeeValue: data.discountFeeValue,
        paymentDate: moment(data.paymentDate)
      };
      formProperties.errorRef.current = {} as Record<
        keyof EditPaymentSafeAttributesFormData,
        string
      >;
    }
  }, [data, formProperties.errorRef, formProperties.valueRef]);

  return (
    <Modal open={open} onClose={onClose} minWidth="70vh">
      <Typography align="center" variant="h4" sx={{ mb: 2 }}>
        Edit Payment
      </Typography>
      {formRenderer()}
    </Modal>
  );
};

export default EditPaymentModalForm;
