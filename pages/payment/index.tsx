import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
// import { EnrollmentPayment } from "@sonamusica-fe/types";
// import PageAdminEnrollmentPaymentTable from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentTable";
// import PageAdminEnrollmentPaymentForm from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentForm";

const EnrollmentPaymentPage = (): JSX.Element => {
  const router = useRouter();
  // const [data, setData] = useState<Array<EnrollmentPayment>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(finishLoading, []);

  return (
    <PageContainer navTitle="Enrollment Payment">
      <Button startIcon={<Add />} variant="outlined" onClick={() => router.push("/payment/new")}>
        New Payment
      </Button>
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

export default EnrollmentPaymentPage;
