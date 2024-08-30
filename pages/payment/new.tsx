import PageContainer from "@sonamusica-fe/components/PageContainer";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useState } from "react";
import { FailedResponse } from "api";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Divider, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { Container } from "@mui/system";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import NewPaymentStepOne from "@sonamusica-fe/components/Pages/Payment/NewPayment/StepOne";
import { EnrollmentPaymentInvoice, StudentEnrollment } from "@sonamusica-fe/types";
import NewPaymentStepTwo from "@sonamusica-fe/components/Pages/Payment/NewPayment/StepTwo";
import NewPaymentStepThree from "@sonamusica-fe/components/Pages/Payment/NewPayment/StepThree";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import { convertMomentDateToRFC3339 } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { SubmitPaymentBalanceFormRequest } from "@sonamusica-fe/types/form/payment";

const steps = ["Select Student", "Create Invoice", "Finalize"];

const NewEnrollmentPaymentPage = (): JSX.Element => {
  const { replace } = useRouter();
  const [studentEnrollment, setStudentEnrollment] = useState<StudentEnrollment>();
  const [invoiceData, setInvoiceData] = useState<EnrollmentPaymentInvoice>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [recalculateInvoice, setRecalculateInvoice] = useState<boolean>(true);

  const apiTransformer = useApiTransformer();
  const { push } = useRouter();
  const { showDialog } = useAlertDialog();
  const { showSnackbar } = useSnack();

  const onSearchEnrollmentPaymentClick = useCallback(() => {
    showDialog(
      {
        title: "Going to search enrollment payment page...",
        content: "All changes in this page will be lost. Proceed?"
      },
      () => {
        push({
          pathname: "/payment"
        });
      }
    );
  }, [showDialog, push]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else
      showDialog(
        {
          title: "Discard Changes",
          content: "Discard all changes, and return to the homepage?"
        },
        () => {
          replace("/");
        }
      );
  };

  const submitPayment = useCallback(
    (data: SubmitPaymentBalanceFormRequest, callback: () => void) => {
      setLoading(true);
      API.SubmitPayment(data)
        .then((response) => {
          const parsedResponse = apiTransformer(response);
          if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
            showSnackbar("Failed to submit payment data", "error");
          } else {
            callback();
          }
        })
        .finally(() => setLoading(false));
    },
    []
  );

  let content;

  switch (currentStep) {
    case 0:
      {
        content = (
          <NewPaymentStepOne
            setStudentEnrollment={setStudentEnrollment}
            setRecalculateInvoice={setRecalculateInvoice}
            defaultClass={studentEnrollment?.class}
            defaultStudent={studentEnrollment?.student}
          />
        );
      }
      break;
    case 1:
      {
        content = (
          <NewPaymentStepTwo
            studentEnrollmentData={studentEnrollment}
            setInvoiceData={setInvoiceData}
            invoiceData={invoiceData}
            setRecalculateInvoice={setRecalculateInvoice}
            recalculateInvoiceData={recalculateInvoice}
          />
        );
      }
      break;
    case 2:
      {
        content = (
          <NewPaymentStepThree
            studentEnrollmentData={studentEnrollment}
            invoiceData={invoiceData}
          />
        );
      }
      break;
  }

  if (loading) content = <LoaderSimple />;

  return (
    <PageContainer navTitle="Add New Payment">
      <Container
        maxWidth="sm"
        sx={{
          height: "calc(100vh - 136px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4
        }}
      >
        <Paper
          sx={{ p: 2, height: "100%", width: "100%", display: "flex", flexDirection: "column" }}
          elevation={5}
        >
          <Box sx={{ width: "100%", my: 2 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" flexDirection="column" height="100%">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
              sx={{ height: "calc(100vh - 400px)", overflowY: "auto", mb: 1 }}
            >
              {content}
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button variant="outlined" color="error" onClick={prevStep} disabled={loading}>
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
              {currentStep !== steps.length - 1 && (
                <Button
                  color="info"
                  variant="outlined"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && studentEnrollment === undefined) ||
                    (currentStep === 1 && invoiceData === undefined) ||
                    loading
                  }
                >
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Box>
                  <Button
                    sx={{ mx: 0.5 }}
                    color="info"
                    variant="outlined"
                    onClick={() => {
                      submitPayment(
                        {
                          studentEnrollmentId: studentEnrollment?.studentEnrollmentId || 0,
                          balanceTopUp: invoiceData?.balanceTopUp || 0,
                          balanceBonus: invoiceData?.balanceBonus || 0,
                          courseFeeValue: invoiceData?.courseFeeValue || 0,
                          transportFeeValue: invoiceData?.transportFeeValue || 0,
                          penaltyFeeValue: invoiceData?.penaltyFeeValue || 0,
                          paymentDate:
                            invoiceData?.paymentDate || convertMomentDateToRFC3339(moment())
                        },
                        () => replace("/payment")
                      );
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    sx={{ mx: 0.5 }}
                    color="info"
                    variant="outlined"
                    onClick={() => {
                      submitPayment(
                        {
                          studentEnrollmentId: studentEnrollment?.studentEnrollmentId || 0,
                          balanceTopUp: invoiceData?.balanceTopUp || 0,
                          balanceBonus: invoiceData?.balanceBonus || 0,
                          courseFeeValue: invoiceData?.courseFeeValue || 0,
                          transportFeeValue: invoiceData?.transportFeeValue || 0,
                          penaltyFeeValue: invoiceData?.penaltyFeeValue || 0,
                          paymentDate:
                            invoiceData?.paymentDate || convertMomentDateToRFC3339(moment())
                        },
                        () => {
                          setCurrentStep(0);
                          setStudentEnrollment(undefined);
                          setInvoiceData(undefined);
                        }
                      );
                    }}
                  >
                    Submit & Add Another
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
        <Button
          startIcon={<SearchIcon />}
          sx={{ mt: 1, width: "fit-content" }}
          size="small"
          onClick={onSearchEnrollmentPaymentClick}
          variant="text"
        >
          <small>Search Enrollment Payment</small>
        </Button>
      </Container>
    </PageContainer>
  );
};

export default NewEnrollmentPaymentPage;
