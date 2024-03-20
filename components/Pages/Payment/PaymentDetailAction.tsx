import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import { getCourseName, getFullNameFromStudent } from "@sonamusica-fe/utils/StringUtil";
import React, { useState } from "react";

type PaymentDetailActionProps = {
  data: EnrollmentPayment;
  deleteHandler: () => void;
  editHandler: () => void;
};

const PaymentDetailAction = ({ data, deleteHandler, editHandler }: PaymentDetailActionProps) => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <LoadingButton
        key={"delete-" + data.enrollmentPaymentId}
        startIcon={<Delete />}
        size="small"
        fullWidth
        color="error"
        loading={loading}
        variant="outlined"
        sx={{ mr: 0.5 }}
        onClick={() => {
          showDialog(
            {
              title: "Delete Payment",
              content: `Are you sure to delete ${getFullNameFromStudent(
                data.studentEnrollment.student
              )} payment for ${getCourseName(data.studentEnrollment.class.course)}?`
            },
            () => {
              setLoading(true);
              API.RemovePayment({ enrollmentPaymentId: data.enrollmentPaymentId })
                .then((response) => {
                  apiTransformer(response, true);
                  deleteHandler();
                })
                .finally(() => setLoading(false));
            }
          );
        }}
      >
        Delete
      </LoadingButton>
      <LoadingButton
        key={"edit-" + data.enrollmentPaymentId}
        onClick={editHandler}
        startIcon={<Edit />}
        size="small"
        disabled={loading}
        fullWidth
        color="info"
        variant="outlined"
        sx={{ ml: 0.5 }}
      >
        Edit
      </LoadingButton>
    </>
  );
};

export default React.memo(PaymentDetailAction);
