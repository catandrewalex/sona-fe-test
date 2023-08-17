import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { useRouter } from "next/router";
import { Box, Button, Divider, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { Add, ArrowLeft, ArrowRight, ArrowRightAlt } from "@mui/icons-material";
import { Container, styled } from "@mui/system";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import NewPaymentStepOne from "@sonamusica-fe/components/Pages/Payment/NewPayment/StepOne";
import { StudentEnrollment } from "@sonamusica-fe/types";
// import { EnrollmentPayment } from "@sonamusica-fe/types";
// import PageAdminEnrollmentPaymentTable from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentTable";
// import PageAdminEnrollmentPaymentForm from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentForm";

const steps = ["Select Student", "Create Invoice", "Finalize", "Print Invoice"];

const NewEnrollmentPaymentPage = (): JSX.Element => {
  const { replace } = useRouter();
  const [invoiceData, setInvoiceData] = useState<StudentEnrollment>();
  // const [data, setData] = useState<Array<EnrollmentPayment>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  // const [selectedData, setSelectedData] = useState<EnrollmentPayment>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else
      showDialog(
        {
          title: "Discard Changes",
          content:
            "Are you sure want to cancel adding new enrollment payment? This will discard all changes and take you back to home page."
        },
        () => {
          replace("/");
        }
      );
  };

  //   useEffect(() => {
  //     if (user) {
  //       API.GetAllEnrollmentPayment()
  //         .then((response) => {
  //           const parsedResponse = apiTransformer(response, false);
  //           if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
  //             setData((parsedResponse as ResponseMany<EnrollmentPayment>).results);
  //           }
  //         })
  //         .finally(() => {
  //           finishLoading();
  //           setLoading(false);
  //         });
  //     }
  //   }, [user]);

  let content;

  switch (currentStep) {
    case 0:
      {
        content = (
          <NewPaymentStepOne
            setInvoice={setInvoiceData}
            defaultClass={invoiceData?.class}
            defaultStudent={invoiceData?.student}
          />
        );
      }
      break;
    case 1:
      {
        content = <Box>Step 2</Box>;
      }
      break;
    case 2:
      {
        content = <Box>Step 3</Box>;
      }
      break;
    case 3:
      {
        content = <Box>Step 4</Box>;
      }
      break;
  }

  return (
    <PageContainer navTitle="Add New Payment">
      <Container
        maxWidth="sm"
        sx={{
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mt: 4
        }}
      >
        <Paper
          sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
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
            <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1}>
              {content}
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button variant="outlined" color="error" onClick={prevStep}>
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                color="info"
                variant="outlined"
                onClick={nextStep}
                disabled={currentStep === 0 && invoiceData === undefined}
              >
                {currentStep === steps.length - 2 ? "Submit" : "Next"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <div></div>
      {/* <PageAdminEnrollmentPaymentTable
        data={data}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminEnrollmentPaymentForm
        selectedData={selectedData}
        data={data}
        open={open}
        setData={setData}
        onClose={() => {
          setOpen(false);
          setSelectedData(undefined);
        }}
      /> */}
    </PageContainer>
  );
};

export default NewEnrollmentPaymentPage;
