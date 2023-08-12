import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { useRouter } from "next/router";
import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import moment, { Moment } from "moment";
import SearchEnrollmentPayment from "@sonamusica-fe/components/Pages/Payment/SearchEnrollmentPayment";
import SearchFilter from "@sonamusica-fe/components/Search/SearchFilter";
import { EnrollmentPayment, Student, StudentEnrollment, Teacher } from "@sonamusica-fe/types";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import SearchResult from "@sonamusica-fe/components/Search/SearchResult";

enum Page {
  SEARCH,
  CARD_LIST
}

const EnrollmentPaymentPage = (): JSX.Element => {
  const router = useRouter();
  const [page, setPage] = useState<Page>(Page.SEARCH);
  const [data, setData] = useState<Array<EnrollmentPayment>>([]);
  const [displayData, setDisplayData] = useState<Array<EnrollmentPayment>>([]);

  const [studentEnrollmentData, setStudentEnrollmentData] = useState<StudentEnrollment[]>([]);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { showSnackbar } = useSnack();
  // const [selectedData, setSelectedData] = useState<EnrollmentPayment>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  const movePage = () => setPage(Page.CARD_LIST);

  useEffect(() => {
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
          setDisplayData((parsedResponse as ResponseMany<EnrollmentPayment>).results);
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
  }, [user]);

  console.log("data", displayData);
  const content =
    page === Page.SEARCH ? (
      <SearchEnrollmentPayment movePage={movePage} setData={setData} />
    ) : (
      <Box>
        <SearchFilter<EnrollmentPayment>
          data={data}
          setData={setDisplayData}
          filters={[
            {
              type: "text",
              label: "Testing",
              filterHandle: (data, value) => {
                console.log(data, value);
                return true;
              }
            },
            {
              type: "select",
              label: "Students",
              data: studentData,
              getOptionLabel(option) {
                return (
                  option.user.userDetail.firstName + " " + (option.user.userDetail.lastName || "")
                );
              },
              filterHandle(data, value) {
                console.log(data, value);
                return true;
              }
            },
            {
              type: "arithmetic",
              label: "Fee",
              filterHandle(data, value) {
                console.log(data, value);
                return true;
              }
            }
          ]}
        />
        <Divider sx={{ my: 1 }} />
        <SearchResult
          data={[...displayData, ...displayData, ...displayData, ...displayData, ...displayData]}
          getDataContent={(data) => data.enrollmentPaymentId.toString()}
          getDataKey={(data) => data.enrollmentPaymentId}
          getDataTitle={(data) => data.transportFeeValue.toString()}
        />
      </Box>
    );

  return <PageContainer navTitle="Enrollment Payment">{content}</PageContainer>;
};

export default EnrollmentPaymentPage;
