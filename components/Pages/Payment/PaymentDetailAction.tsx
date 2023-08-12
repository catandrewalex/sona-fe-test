import { Delete, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { EnrollmentPayment } from "@sonamusica-fe/types";

const PaymentDetailAction = (data: EnrollmentPayment) => {
  return [
    <Button
      key={"delete-" + data.enrollmentPaymentId}
      startIcon={<Delete />}
      size="small"
      fullWidth
      color="error"
      variant="outlined"
      sx={{ mr: 0.5 }}
    >
      Delete
    </Button>,
    <Button
      key={"edit-" + data.enrollmentPaymentId}
      startIcon={<Edit />}
      size="small"
      fullWidth
      color="info"
      variant="outlined"
      sx={{ ml: 0.5 }}
    >
      Edit
    </Button>
  ];
};

export default PaymentDetailAction;
