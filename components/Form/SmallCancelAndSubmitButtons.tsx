import { Box } from "@mui/system";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";

interface SmallCancelAndSubmitButtonsProps {
  loading?: boolean;
  cancelButtonText: string;
  cancelButtonDisabled?: boolean;
  cancelButtonOnClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  submitButtonText: string;
  submitButtonDisabled?: boolean;
  submitButtonOnClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
export const SmallCancelAndSubmitButtons = ({
  loading,
  cancelButtonText,
  cancelButtonDisabled,
  cancelButtonOnClick,
  submitButtonText,
  submitButtonDisabled,
  submitButtonOnClick
}: SmallCancelAndSubmitButtonsProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
      <SubmitButton
        variant="contained"
        color="error"
        submitText={cancelButtonText}
        disabled={cancelButtonDisabled}
        size="small"
        sx={{ fontSize: "0.875rem" }}
        regular
        onClick={cancelButtonOnClick}
      ></SubmitButton>
      <SubmitButton
        variant="contained"
        color="primary"
        submitText={submitButtonText}
        disabled={submitButtonDisabled}
        loading={loading}
        size="small"
        sx={{ fontSize: "0.875rem" }}
        onClick={submitButtonOnClick}
      ></SubmitButton>
    </Box>
  );
};
