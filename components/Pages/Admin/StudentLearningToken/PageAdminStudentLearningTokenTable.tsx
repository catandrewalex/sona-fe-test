import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { StudentLearningToken, Student, Teacher } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
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
    <TableContainer testIdContext="AdminStudentLearningToken" height="calc(80vh)">
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
                  content: `Are you sure to delete ${getFullNameFromStudent(
                    row.studentEnrollment.student
                  )} learning token on ${getCourseName(row.studentEnrollment.class.course)}?`
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
            valueGetter: (params) => getFullNameFromStudent(params.row.studentEnrollment.student)
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
            field: "lastUpdatedAt",
            headerName: "Last Update",
            width: 200,
            valueGetter: (params) => moment(params.row.lastUpdatedAt).format("DD MMMM YYYY")
          }
        ]}
        tableMenu={[
          {
            type: "select",
            data: studentData,
            field: "students",
            getOptionLabel: (option) => getFullNameFromStudent(option),
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
            type: "select",
            data: teacherData,
            field: "teachers",
            getOptionLabel: (option) => getFullNameFromTeacher(option),
            md: 6,
            lg: 6,
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

export default PageAdminStudentLearningTokenTable;
