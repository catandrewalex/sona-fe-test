import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { EnrollmentPayment, Student, Teacher } from "@sonamusica-fe/types";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import {
  advancedNumberFilter,
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  searchCourseNameByValue
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";

type PageAdminEnrollmentPaymentTableProps = {
  data: EnrollmentPayment[];
  studentData: Student[];
  teacherData: Teacher[];
  setSelectedData: (newSelectedData?: EnrollmentPayment) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: EnrollmentPayment[]) => void;
};

const PageAdminEnrollmentPaymentTable = ({
  data,
  studentData,
  teacherData,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData
}: PageAdminEnrollmentPaymentTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer testIdContext="AdminEnrollmentPayment" height="calc(80vh)">
      <Table
        name="Enrollment Payment"
        testIdContext="AdminEnrollmentPayment"
        loading={loading}
        getRowId={(row) => row.enrollmentPaymentId}
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        columnVisibilityModelDefault={{
          lastUpdatedAt: false
        }}
        rows={data}
        columns={[
          useTableActions({
            editHandler: ({ id }) => {
              setSelectedData(data.filter((val) => val.enrollmentPaymentId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Enrollment Payment",
                  content: `Are you sure to delete ${getFullNameFromStudent(
                    row.studentEnrollment.student
                  )} payment on ${getCourseName(row.studentEnrollment.class.course)}?`
                },
                () => {
                  setLoading(true);
                  ADMIN_API.DeleteEnrollmentPayment([{ enrollmentPaymentId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.enrollmentPaymentId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "enrollmentPaymentId",
            headerName: "ID",
            width: 100,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "student",
            headerName: "Student",
            flex: 2,
            valueGetter: (params) => getFullNameFromStudent(params.row.studentEnrollment.student)
          },

          {
            field: "balanceTopUp",
            headerName: "Balance",
            width: 75,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.balanceTopUp
          },
          {
            field: "courseFeeValue",
            headerName: "Course Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.courseFeeValue,
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          },
          {
            field: "penaltyFeeValue",
            headerName: "Penalty Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.penaltyFeeValue,
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          },
          {
            field: "transportFeeValue",
            headerName: "Transport Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.transportFeeValue,
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          },
          {
            field: "instrument-grade",
            headerName: "Course",
            flex: 3,
            valueGetter: (params) => getCourseName(params.row.studentEnrollment.class.course)
          },
          {
            field: "teachers",
            headerName: "Teacher",
            flex: 3,
            valueGetter: (params) =>
              getFullNameFromTeacher(params.row.studentEnrollment.class.teacher)
          },
          {
            field: "paymentDate",
            headerName: "Payment Date",
            width: 200,
            valueGetter: (params) => moment(params.row.paymentDate).format("DD MMMM YYYY")
          }
        ]}
        tableMenu={[
          {
            type: "select",
            data: studentData,
            field: "students",
            getOptionLabel: (option) => getFullNameFromStudent(option),
            md: 6,
            lg: 4,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.studentEnrollment.student.studentId === val.studentId;
                if (result) return true;
              }
              return false;
            }
          },
          {
            type: "select",
            data: teacherData,
            field: "teachers",
            getOptionLabel: (option) => getFullNameFromTeacher(option),
            md: 6,
            lg: 4,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.studentEnrollment.class.teacher.teacherId === val.teacherId;
                if (result) return true;
              }
              return false;
            }
          },
          {
            type: "text-input",
            field: "instrument-grade",
            columnLabel: "Course",
            md: 6,
            lg: 4,
            filterHandler: (data, value) =>
              searchCourseNameByValue(value, data.studentEnrollment.class.course)
          },

          {
            type: "text-input",
            field: "courseFeeValue",
            columnLabel: "Course Fee",
            helperText: "Equality signs can be used (<=700000, 375000, etc.)",
            md: 4,
            lg: 4,
            filterHandler: (data, value) => advancedNumberFilter(data.courseFeeValue, value.trim())
          },
          {
            type: "text-input",
            field: "penaltyFeeValue",
            columnLabel: "Penalty Fee",
            helperText: "Equality signs can be used (<=700000, 375000, etc.)",
            md: 4,
            lg: 4,
            filterHandler: (data, value) => advancedNumberFilter(data.penaltyFeeValue, value.trim())
          },
          {
            type: "text-input",
            field: "transportFeeValue",
            columnLabel: "Transport Fee",
            helperText: "Equality signs can be used (<=700000, 375000, etc.)",
            md: 4,
            lg: 4,
            filterHandler: (data, value) =>
              advancedNumberFilter(data.transportFeeValue, value.trim())
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminEnrollmentPaymentTable;
