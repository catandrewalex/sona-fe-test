import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import {
  Student,
  TeacherPaymentInvoiceItem,
  TeacherPaymentInvoiceItemAttendanceModify,
  TeacherPaymentInvoiceItemModify,
  TeacherPaymentInvoiceItemStudentLearningToken
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
import { FailedResponse, ResponseMany } from "api";
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

  const [prevPaidTotal, setPrevPaidTotal] = useState<number>(0);
  const [rawData, setRawData] = useState<TeacherPaymentInvoiceItem[] | undefined>(undefined);
  const [submitData, setSubmitData] = useState<Record<string, TeacherPaymentInvoiceItemModify>>({});

  const apiTransformer = useApiTransformer();

  const handleSubmitDataChange = useCallback(
    (teacherPaymentId: number, paidCourseFeeValue: number, paidTransportFeeValue: number) => {
      setSubmitData((prevValue) => {
        const newSubmitData = { ...prevValue };
        newSubmitData[teacherPaymentId.toString()] = {
          ...newSubmitData[teacherPaymentId.toString()],
          teacherPaymentId,
          paidCourseFeeValue,
          paidTransportFeeValue
        };
        return newSubmitData;
      });
    },
    []
  );

  const handleDeleteData = useCallback((teacherPaymentId: number, value: boolean) => {
    setSubmitData((prevValue) => {
      const newSubmitData = { ...prevValue };
      newSubmitData[teacherPaymentId.toString()] = {
        ...newSubmitData[teacherPaymentId.toString()],
        teacherPaymentId,
        isDeleted: value
      };
      return newSubmitData;
    });
  }, []);

  const calculateGrandTotal = useCallback(
    (data: Record<string, TeacherPaymentInvoiceItemModify>) => {
      return Object.values(data).reduce(
        (prev, curr) =>
          curr.isDeleted ? prev : prev + curr.paidCourseFeeValue + curr.paidTransportFeeValue,
        0
      );
    },
    []
  );

  const calculateGrossGrandTotal = () => {
    return Object.values(submitData).reduce(
      (prev, curr) =>
        curr.isDeleted ? prev : prev + curr.grossCourseFeeValue + curr.grossTransportFeeValue,
      0
    );
  };

  const handleSubmit = () => {
    showDialog({ title: "Save Payment", content: "Are you sure to save the payment?" }, () => {
      startLoading();
      API.ModifyTeacherPaymentInvoice(Object.values(submitData))
        .then((response) => {
          const result = apiTransformer(response);
          if (Object.getPrototypeOf(result) !== FailedResponse.prototype) {
            setPage(1);
          }
        })
        .finally(() => finishLoading());
    });
  };

  const handleBackAction = useCallback(() => {
    back();
  }, [back]);

  useEffect(() => {
    if (isReady && query.id && typeof query.id === "string") {
      startLoading();
      const year =
        typeof query.year == "string" && query.year !== "" ? parseInt(query.year) : undefined;
      const month =
        typeof query.month == "string" && query.month !== "" ? parseInt(query.month) : undefined;
      API.GetPaidTeacherPaymentInvoice(parseInt(query.id), year, month).then((response) => {
        const result = apiTransformer(response, false);
        const tempRawData = (result as ResponseMany<TeacherPaymentInvoiceItem>).results;

        const tempSubmitData: Record<string, TeacherPaymentInvoiceItemModify> = {};

        for (const data of tempRawData) {
          for (const student of data.students) {
            for (const studentLearningToken of student.studentLearningTokens) {
              for (const attendance of studentLearningToken.attendances) {
                tempSubmitData[
                  (
                    attendance as TeacherPaymentInvoiceItemAttendanceModify
                  ).teacherPaymentId.toString()
                ] = {
                  teacherPaymentId: (attendance as TeacherPaymentInvoiceItemAttendanceModify)
                    .teacherPaymentId,
                  paidCourseFeeValue:
                    attendance.grossCourseFeeValue * attendance.courseFeeSharingPercentage,
                  paidTransportFeeValue:
                    attendance.grossTransportFeeValue * attendance.transportFeeSharingPercentage,
                  grossCourseFeeValue: attendance.grossCourseFeeValue,
                  grossTransportFeeValue: attendance.grossTransportFeeValue
                };
              }
            }
          }
        }
        setPrevPaidTotal(calculateGrandTotal(tempSubmitData));
        setRawData(tempRawData);
        setSubmitData(tempSubmitData);
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
              totalPaidValue={calculateGrandTotal(submitData)}
              totalGrossPaidValue={calculateGrossGrandTotal()}
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
          <Typography variant="h4" align="center">
            {getFullNameFromTeacher(rawData[0].teacher)} payment has been updated from{" "}
            {convertNumberToCurrencyString(prevPaidTotal)} to{" "}
            {convertNumberToCurrencyString(calculateGrandTotal(submitData))}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default EditTeacherPaymentDetailPage;
