import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import {
  Student,
  TeacherPaymentInvoiceItem,
  TeacherPaymentInvoiceItemStudentLearningToken,
  TeacherPaymentInvoiceItemSubmit
} from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import TeacherPaymentInvoiceContainer from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentInvoiceContainer";
import TeacherPaymentClassContainer from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentClassContainer";
import TeacherPaymentItemContainer from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentItem/TeacherPaymentItemContainer";
import { ResponseMany } from "api";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { ArrowBack, SaveAs } from "@mui/icons-material";

const EditTeacherPaymentDetailPage = (): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const { showDialog } = useAlertDialog();

  const { query, isReady, back } = useRouter();
  const { finishLoading, startLoading } = useApp((state) => ({
    finishLoading: state.finishLoading,
    startLoading: state.startLoading
  }));

  const [rawData, setRawData] = useState<TeacherPaymentInvoiceItem[] | undefined>(undefined);
  const [submitData, setSubmitData] = useState<Record<string, TeacherPaymentInvoiceItemSubmit>>({});
  const [grossGrandTotal, setGrossGrandTotal] = useState<number>(0);

  const apiTransformer = useApiTransformer();

  const handleSubmitDataChange = useCallback(
    (attendanceId: number, paidCourseFeeValue: number, paidTransportFeeValue: number) => {
      setSubmitData((prevValue) => {
        const newSubmitData = { ...prevValue };
        newSubmitData[attendanceId.toString()] = {
          ...newSubmitData[attendanceId.toString()],
          attendanceId,
          paidCourseFeeValue,
          paidTransportFeeValue
        };
        return newSubmitData;
      });
    },
    []
  );

  const handleDeleteData = useCallback((attendanceId: number, value: boolean) => {
    setSubmitData((prevValue) => {
      const newSubmitData = { ...prevValue };
      newSubmitData[attendanceId.toString()] = {
        ...newSubmitData[attendanceId.toString()],
        attendanceId,
        isDeleted: value
      };
      return newSubmitData;
    });
  }, []);

  const calculateGrandTotal = () => {
    return Object.values(submitData).reduce(
      (prev, curr) => prev + curr.paidCourseFeeValue + curr.paidTransportFeeValue,
      0
    );
  };

  const handleSubmit = () => {
    showDialog({ title: "Submit Payment", content: "Are you sure to submit the payment?" }, () => {
      // startLoading();
      // API.SubmitTeacherPaymentInvoice(Object.values(submitData))
      //   .then((response) => {
      //     const result = apiTransformer(response);
      //     if (Object.getPrototypeOf(result) !== FailedResponse.prototype) {
      //       setPage(1);
      //     }
      //   })
      //   .finally(() => finishLoading());
      console.log(submitData);
    });
  };

  const handleBackAction = useCallback(() => {
    back();
  }, [back]);

  useEffect(() => {
    if (isReady && query.id && typeof query.id === "string") {
      let grossGrandTotalTemp = 0;
      startLoading();
      const year = typeof query.year == "string" ? parseInt(query.year) : undefined;
      const month = typeof query.month == "string" ? parseInt(query.month) : undefined;
      API.GetTeacherPaymentInvoice(parseInt(query.id), year, month).then((response) => {
        const result = apiTransformer(response, false);
        const tempRawData = (result as ResponseMany<TeacherPaymentInvoiceItem>).results;

        const tempSubmitData: Record<string, TeacherPaymentInvoiceItemSubmit> = {};

        for (const data of tempRawData) {
          for (const student of data.students) {
            for (const studentLearningToken of student.studentLearningTokens) {
              for (const attendance of studentLearningToken.attendances) {
                tempSubmitData[attendance.attendanceId.toString()] = {
                  attendanceId: attendance.attendanceId,
                  paidCourseFeeValue:
                    attendance.grossCourseFeeValue * attendance.courseFeeSharingPercentage,
                  paidTransportFeeValue:
                    attendance.grossTransportFeeValue * attendance.transportFeeSharingPercentage
                };
                grossGrandTotalTemp +=
                  attendance.grossTransportFeeValue + attendance.grossCourseFeeValue;
              }
            }
          }
        }

        setRawData(tempRawData);
        setSubmitData(tempSubmitData);
        setGrossGrandTotal(grossGrandTotalTemp);
        finishLoading();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, query.id]);

  return (
    <PageContainer
      navTitle={
        rawData && rawData[0]?.teacher
          ? `Invoice - ${getFullNameFromTeacher(rawData[0].teacher)}`
          : "Invoice"
      }
    >
      {page === 0 && rawData ? (
        <>
          <Button
            onClick={handleBackAction}
            color="error"
            sx={{ mt: 2 }}
            variant="outlined"
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          <Box>
            <TeacherPaymentInvoiceContainer
              totalPaidValue={calculateGrandTotal()}
              totalGrossPaidValue={grossGrandTotal}
            >
              {rawData.map((classData, idx, arr) => (
                <TeacherPaymentClassContainer
                  key={classData.classId}
                  courseName={getCourseName(classData.course)}
                  divider={idx !== arr.length - 1}
                >
                  {classData.students.map(
                    (
                      studentData: Pick<Student, "studentId" | "user"> & {
                        studentLearningTokens: Array<TeacherPaymentInvoiceItemStudentLearningToken>;
                      }
                    ) => (
                      <TeacherPaymentItemContainer
                        isEdit
                        handleSubmitDataChange={handleSubmitDataChange}
                        handleDeleteData={handleDeleteData}
                        key={studentData.studentId}
                        data={studentData}
                        classId={classData.classId}
                      />
                    )
                  )}
                </TeacherPaymentClassContainer>
              ))}
            </TeacherPaymentInvoiceContainer>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                startIcon={<SaveAs />}
                variant="contained"
                color="success"
                size="large"
                onClick={handleSubmit}
              >
                Save Payment
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
      {page === 1 && rawData && rawData[0].teacher ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 160px)"
        >
          <Typography my={4} variant="h3" color={(theme) => theme.palette.success.main}>
            Success!
          </Typography>
          <Typography variant="h4">
            {getFullNameFromTeacher(rawData[0].teacher)} has been paid{" "}
            {convertNumberToCurrencyString(calculateGrandTotal())}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default EditTeacherPaymentDetailPage;
