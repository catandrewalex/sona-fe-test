import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { EnrollmentPayment, StudentEnrollment, Student, Teacher } from "@sonamusica-fe/types";
import PageAdminEnrollmentPaymentTable from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentTable";
import PageAdminEnrollmentPaymentForm from "@sonamusica-fe/components/Pages/Admin/EnrollmentPayment/PageAdminEnrollmentPaymentForm";
import { Alert, Typography } from "@mui/material";
import Link from "next/link";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";

const EnrollmentPaymentPage = (): JSX.Element => {
  const [data, setData] = useState<Array<EnrollmentPayment>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<EnrollmentPayment>();
  const [studentEnrollmentData, setStudentEnrollmentData] = useState<StudentEnrollment[]>([]);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);

  const { showSnackbar } = useSnack();
  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (user) {
      const promises = [
        API.GetAllEnrollmentPayment(),
        API.GetAllStudentEnrollment(),
        API.GetAllStudent(),
        API.GetAllTeacher()
      ];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<EnrollmentPayment>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<EnrollmentPayment>).results);
          }
        } else {
          showSnackbar("Failed to fetch student learning token data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<StudentEnrollment>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentEnrollmentData((parsedResponse as ResponseMany<StudentEnrollment>).results);
          }
        } else {
          showSnackbar("Failed to fetch student enrollment data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Student>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentData((parsedResponse as ResponseMany<Student>).results);
          }
        } else {
          showSnackbar("Failed to fetch students data!", "error");
        }
        if (value[3].status === "fulfilled") {
          const response = value[3].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }

        finishLoading();
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Enrollment Payment">
      <Alert sx={{ my: 2 }} severity="warning">
        <Typography>WARNING</Typography>
        <Typography component="span" fontWeight="bold" variant="body2">
          Creating, updating, or deleting
        </Typography>{" "}
        from this page may cause{" "}
        <Typography component="span" fontWeight="bold" variant="body2">
          inconsistencies
        </Typography>{" "}
        to your system. Please avoid doing these actions{" "}
        <Typography component="span" fontWeight="bold" variant="body2">
          unless you really know what you are doing.
        </Typography>{" "}
        <Typography variant="body2">
          If you wish to manage this entity, you can visit{" "}
          <Link href="/test">
            <Typography variant="body2" sx={{ cursor: "pointer" }} component="span" color="blue">
              this page
            </Typography>
          </Link>{" "}
          instead.
        </Typography>
      </Alert>
      <PageAdminEnrollmentPaymentTable
        data={data}
        studentData={studentData}
        teacherData={teacherData}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminEnrollmentPaymentForm
        selectedData={selectedData}
        studentEnrollmentData={studentEnrollmentData}
        data={data}
        open={open}
        setData={setData}
        onClose={() => {
          setOpen(false);
          setSelectedData(undefined);
        }}
      />
    </PageContainer>
  );
};

export default EnrollmentPaymentPage;
