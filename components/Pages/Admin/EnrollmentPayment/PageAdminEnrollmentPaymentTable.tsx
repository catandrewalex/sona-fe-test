import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { EnrollmentPayment, StudentEnrollment, Student, Teacher } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import {
  advancedNumberFilter,
  convertNumberToCurrencyString
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
                  content: `Are you sure want to delete ${
                    row.studentEnrollment.student.user.userDetail.firstName
                  }${
                    row.studentEnrollment.student.user.userDetail.lastName
                      ? " " + row.studentEnrollment.student.user.userDetail.lastName
                      : ""
                  } payment on ${row.studentEnrollment.class.course.grade.name} - ${
                    row.studentEnrollment.class.course.instrument.name
                  }?`
                },
                () => {
                  setLoading(true);
                  API.DeleteEnrollmentPayment([{ enrollmentPaymentId: id as number }])
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
            valueGetter: (params) =>
              params.row.studentEnrollment.student?.user?.userDetail?.firstName
                ? (params.row.studentEnrollment.student?.user?.userDetail?.firstName || "") +
                  " " +
                  (params.row.studentEnrollment.student?.user?.userDetail?.lastName || "")
                : "-"
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
            field: "valuePenalty",
            headerName: "Penalty Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.valuePenalty,
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
            valueGetter: (params) =>
              params.row.studentEnrollment.class.course.instrument.name +
              " - " +
              params.row.studentEnrollment.class.course.grade.name
          },
          {
            field: "teachers",
            headerName: "Teacher",
            flex: 2,
            valueGetter: (params) =>
              params.row.studentEnrollment.class.teacher?.user?.userDetail?.firstName
                ? (params.row.studentEnrollment.class.teacher?.user?.userDetail?.firstName || "") +
                  " " +
                  (params.row.studentEnrollment.class.teacher?.user?.userDetail?.lastName || "")
                : "-"
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
            getOptionLabel: (option) =>
              option.user.userDetail.firstName + " " + option.user.userDetail.lastName ?? "",
            md: 6,
            lg: 6,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.studentEnrollment.student.studentId === val.studentId;
                if (result) return true;
              }
              return false;
            }
          },
          {
            type: "text-input",
            field: "teachers",
            md: 6,
            lg: 3,
            filterHandler: (data, value) =>
              data.studentEnrollment.class.teacher &&
              (data.studentEnrollment.class.teacher.user.userDetail.firstName
                .toLowerCase()
                .includes(value.toLowerCase()) ||
                data.studentEnrollment.class.teacher.user.userDetail.lastName
                  ?.toLowerCase()
                  ?.includes(value.toLowerCase()) ||
                `${data.studentEnrollment.class.teacher.user.userDetail.firstName} ${
                  data.studentEnrollment.class.teacher.user.userDetail.lastName || ""
                }`
                  .toLowerCase()
                  .includes(value.toLowerCase()))
          },
          {
            type: "text-input",
            field: "instrument-grade",
            columnLabel: "Course",
            md: 6,
            lg: 3,
            filterHandler: (data, value) =>
              data.studentEnrollment.class.course.grade.name
                .toLowerCase()
                .includes(value.toLowerCase()) ||
              data.studentEnrollment.class.course.instrument.name
                .toLowerCase()
                .includes(value.toLowerCase()) ||
              `${data.studentEnrollment.class.course.instrument.name} - ${data.studentEnrollment.class.course.grade.name}`
                .toLowerCase()
                .includes(value.toLowerCase())
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
            field: "valuePenalty",
            columnLabel: "Penalty Fee",
            helperText: "Equality signs can be used (<=700000, 375000, etc.)",
            md: 4,
            lg: 4,
            filterHandler: (data, value) => advancedNumberFilter(data.valuePenalty, value.trim())
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
