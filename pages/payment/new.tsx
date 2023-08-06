import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { useRouter } from "next/router";
import { Box, Button, Divider, Step, StepLabel, Stepper } from "@mui/material";
import { Add } from "@mui/icons-material";
// import { EnrollmentPayment } from "@sonamusica-fe/types";
// import PageAdminEnrollmentPaymentTable from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentTable";
// import PageAdminEnrollmentPaymentForm from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentForm";

const steps = ["Select Student", "Create Invoice", "Finalize", "Print Invoice"];

const NewEnrollmentPaymentPage = (): JSX.Element => {
  const router = useRouter();
  // const [data, setData] = useState<Array<EnrollmentPayment>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  // const [selectedData, setSelectedData] = useState<EnrollmentPayment>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

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

  return (
    <PageContainer navTitle="EnrollmentPayment">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="error">
          Back
        </Button>
        <Button variant="contained" color="success">
          Next
        </Button>
      </Box>
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
