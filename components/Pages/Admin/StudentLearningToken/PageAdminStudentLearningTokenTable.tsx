import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { StudentLearningToken, StudentEnrollment, Student, Teacher } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import { convertNumberToCurrencyString } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";

type PageAdminStudentLearningTokenTableProps = {
  data: StudentLearningToken[];
  studentData: Student[];
  teacherData: Teacher[];
  setSelectedData: (newSelectedData?: StudentLearningToken) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: StudentLearningToken[]) => void;
};

const PageAdminStudentLearningTokenTable = ({
  data,
  studentData,
  teacherData,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData
}: PageAdminStudentLearningTokenTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer testIdContext="AdminStudentLearningToken">
      <Table
        name="Student Learning Token"
        testIdContext="AdminStudentLearningToken"
        loading={loading}
        getRowId={(row) => row.studentLearningTokenId}
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
              setSelectedData(data.filter((val) => val.studentLearningTokenId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Student Learning Token",
                  content: `Are you sure want to delete ${
                    row.studentEnrollment.student.user.userDetail.firstName
                  }${
                    row.studentEnrollment.student.user.userDetail.lastName
                      ? " " + row.studentEnrollment.student.user.userDetail.lastName
                      : ""
                  } learning token on ${row.studentEnrollment.class.course.grade.name} - ${
                    row.studentEnrollment.class.course.instrument.name
                  }?`
                },
                () => {
                  setLoading(true);
                  API.DeleteStudentLearningToken([{ studentLearningTokenId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.studentLearningTokenId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "studentLearningTokenId",
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
            field: "quota",
            headerName: "Quota",
            width: 75,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.quota
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
            field: "lastUpdatedAt",
            headerName: "Last Update",
            width: 200,
            valueGetter: (params) => moment(params.row.lastUpdatedAt).format("DD MMMM YYYY")
          }
        ]}
        tableMenu={[
          // {
          //   type: "text-input",
          //   field: "teacher",
          //   md: 6,
          //   lg: 4,
          //   filterHandler: (data, value) =>
          //     data.teacher &&
          //     (data.teacher.user.userDetail.firstName
          //       .toLowerCase()
          //       .includes(value.toLowerCase()) ||
          //       data.teacher.user.userDetail.lastName
          //         ?.toLowerCase()
          //         ?.includes(value.toLowerCase()) ||
          //       `${data.teacher.user.userDetail.firstName} ${
          //         data.teacher.user.userDetail.lastName || ""
          //       }`
          //         .toLowerCase()
          //         .includes(value.toLowerCase()))
          // },
          {
            type: "text-input",
            field: "instrument-grade",
            columnLabel: "Course",
            md: 6,
            lg: 4,
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
            type: "select",
            data: studentData,
            field: "students",
            getOptionLabel: (option) =>
              option.user.userDetail.firstName + " " + option.user.userDetail.lastName ?? "",
            md: 6,
            lg: 4,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.studentEnrollment.student.studentId === val.studentId;
                if (result) return true;
              }
              return false;
            }
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminStudentLearningTokenTable;
