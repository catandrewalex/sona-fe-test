import { Course, EnrollmentPayment, Student, Teacher } from "@sonamusica-fe/types";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import API, { useApiTransformer } from "@sonamusica-fe/api";

import SearchResult from "@sonamusica-fe/components/Search/SearchResult";
import {
  advancedNumberFilter,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import SearchFilter from "@sonamusica-fe/components/Search/SearchFilter";
import { SuccessResponse, FailedResponse, ResponseMany } from "api";
import moment from "moment";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import PaymentDetail from "@sonamusica-fe/components/Pages/Payment/PaymentDetail";
import PaymentDetailAction from "@sonamusica-fe/components/Pages/Payment/PaymentDetailAction";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { useRouter } from "next/router";
import EditPaymentModalForm from "@sonamusica-fe/components/Pages/Payment/EditPaymentModalForm";
import { useUser } from "@sonamusica-fe/providers/AppProvider";

type SearchResultEnrollmentPaymentProps = {
  data: EnrollmentPayment[];
  setData: (newData: EnrollmentPayment[]) => void;
  backButtonHandler: () => void;
};

const SearchResultEnrollmentPayment = ({
  data,
  setData,
  backButtonHandler
}: SearchResultEnrollmentPaymentProps): JSX.Element => {
  const [displayData, setDisplayData] = useState<Array<EnrollmentPayment>>([]);
  const [selectedData, setSelectedData] = useState<EnrollmentPayment>();
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();
  const { showDialog } = useAlertDialog();
  const router = useRouter();
  const user = useUser((state) => state.user);

  const addPaymentHandler = useCallback(() => {
    showDialog(
      {
        title: "Move Page",
        content: "Are you sure to move to Add Enrollment Payment page?"
      },
      () => router.push({ pathname: "/payment/new" })
    );
  }, []);

  useEffect(() => {
    const promises = [
      API.GetStudentDropdownOptions(),
      API.GetTeacherDropdownOptions(),
      API.GetCourseDropdownOptions()
    ];
    Promise.allSettled(promises).then((value) => {
      if (value[0].status === "fulfilled") {
        const response = value[0].value as SuccessResponse<Student>;
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          setStudentData((parsedResponse as ResponseMany<Student>).results);
        }
      } else {
        showSnackbar("Failed to fetch students data!", "error");
      }
      if (value[1].status === "fulfilled") {
        const response = value[1].value as SuccessResponse<Teacher>;
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
        }
      } else {
        showSnackbar("Failed to fetch teachers data!", "error");
      }
      if (value[2].status === "fulfilled") {
        const response = value[2].value as SuccessResponse<Course>;
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          setCourseData((parsedResponse as ResponseMany<Course>).results);
        }
      } else {
        showSnackbar("Failed to fetch courses data!", "error");
      }
    });
  }, [user]);

  useEffect(() => {
    if (displayData.length === 0 && data.length !== 0) {
      setDisplayData(data);
    } else {
      const newDisplayData = [...data];
      const mappedData = displayData.map((item) => item.enrollmentPaymentId);
      setDisplayData(
        newDisplayData.filter((item) => mappedData.includes(item.enrollmentPaymentId))
      );
    }
  }, [data]);

  return (
    <Box sx={{ mt: 1, position: "relative" }}>
      <IconButton
        sx={{ position: "absolute", top: "10px", left: "-25px" }}
        onClick={backButtonHandler}
        color="error"
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        sx={{ position: "absolute", top: "50px", left: "-25px" }}
        onClick={addPaymentHandler}
        color="success"
      >
        <Add />
      </IconButton>
      <SearchFilter<EnrollmentPayment>
        data={data}
        setData={setDisplayData}
        filters={[
          {
            type: "select",
            label: "Students",
            data: studentData,
            getOptionLabel(option) {
              return getFullNameFromStudent(option);
            },
            filterHandle(data, value) {
              for (const val of value) {
                if (val.studentId === data.studentEnrollment.student.studentId) return true;
              }
              return false;
            }
          },
          {
            type: "select",
            label: "Courses",
            data: courseData,
            getOptionLabel(option) {
              return getCourseName(option);
            },
            filterHandle(data, value) {
              for (const val of value) {
                if (val.courseId === data.studentEnrollment.class.course.courseId) return true;
              }
              return false;
            }
          },
          {
            type: "select",
            label: "Teachers",
            data: teacherData,
            getOptionLabel(option) {
              return getFullNameFromTeacher(option);
            },
            filterHandle(data, value) {
              for (const val of value) {
                if (val.teacherId === data.studentEnrollment.class.teacher?.teacherId) return true;
              }
              return false;
            }
          },
          {
            type: "arithmetic",
            label: "Fee",
            filterHandle(data, value) {
              return advancedNumberFilter(data.courseFeeValue, value);
            }
          },
          {
            type: "arithmetic",
            label: "Transport Fee",
            filterHandle(data, value) {
              return advancedNumberFilter(data.transportFeeValue, value);
            }
          },
          {
            type: "arithmetic",
            label: "Penalty Fee",
            filterHandle(data, value) {
              return advancedNumberFilter(data.penaltyFeeValue, value);
            }
          },
          {
            type: "arithmetic",
            label: "Discount Fee",
            filterHandle(data, value) {
              return advancedNumberFilter(data.discountFeeValue, value);
            }
          },
          {
            type: "arithmetic",
            label: "Top Up Balance",
            filterHandle(data, value) {
              return advancedNumberFilter(data.balanceTopUp, value);
            }
          }
        ]}
      />
      <Divider sx={{ my: 1 }} />
      <SearchResult
        data={displayData}
        getDataActions={(currData) => (
          <PaymentDetailAction
            data={currData}
            editHandler={() => setSelectedData(currData)}
            // TODO(FerdiantJoshua): rename the "deleteHandler" as the core deletion action is done by PaymentDetailAction's implementation. This handler only serves as an extra-effect.
            deleteHandler={() => {
              setData(
                data.filter((item) => item.enrollmentPaymentId !== currData.enrollmentPaymentId)
              );
            }}
          />
        )}
        getDataContent={PaymentDetail}
        getDataKey={(data) => data.enrollmentPaymentId}
        getDataTitle={(data) => (
          <>
            <Typography fontWeight="bold">
              {getFullNameFromStudent(data.studentEnrollment.student)}
            </Typography>
            <Typography fontWeight="bold">
              {getCourseName(data.studentEnrollment.class.course)}
            </Typography>
          </>
        )}
        getDataSubTitle={(data) => moment(data.paymentDate).format("DD MMMM YYYY")}
      />
      <EditPaymentModalForm
        data={selectedData}
        onClose={() => setSelectedData(undefined)}
        onSubmit={(newData) => {
          setData(
            data.map((item) =>
              item.enrollmentPaymentId === newData.enrollmentPaymentId ? newData : item
            )
          );
        }}
      />
    </Box>
  );
};
export default SearchResultEnrollmentPayment;
