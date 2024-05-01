import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Attendance, Student, Teacher } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import {
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  searchCourseNameByValue
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";

type PageAdminAttendanceTableProps = {
  data: Attendance[];
  studentData: Student[];
  teacherData: Teacher[];
  setSelectedData: (newSelectedData?: Attendance) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: Attendance[]) => void;
};

const PageAdminAttendanceTable = ({
  data,
  studentData,
  teacherData,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData
}: PageAdminAttendanceTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer
      testIdContext="AdminAttendance"
      height="calc(80vh - 8px)"
      width="calc(100vw - 360px)"
    >
      <Table
        name="Attendance"
        testIdContext="AdminAttendance"
        loading={loading}
        getRowId={(row) => row.attendanceId}
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
              setSelectedData(data.filter((val) => val.attendanceId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Attendance",
                  content: `Are you sure to delete ${getFullNameFromStudent(
                    row.studentEnrollment.student
                  )} attendance on ${getCourseName(row.studentEnrollment.class.course)}?`
                },
                () => {
                  setLoading(true);
                  API.DeleteAttendance([{ attendanceId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.attendanceId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "attendanceId",
            headerName: "ID",
            width: 100,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "student",
            headerName: "Student",
            width: 200,
            valueGetter: (params) => getFullNameFromStudent(params.row.student)
          },
          {
            field: "instrument-grade",
            headerName: "Course",
            width: 200,
            valueGetter: (params) => getCourseName(params.row.class.course)
          },
          {
            field: "teachers",
            headerName: "Teacher",
            width: 200,
            valueGetter: (params) => getFullNameFromTeacher(params.row.teacher)
          },
          {
            field: "usedStudentTokenQuota",
            headerName: "Quota Used",
            width: 125,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.usedStudentTokenQuota
          },
          {
            field: "duration",
            headerName: "Duration (Minute)",
            width: 150,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.duration
          },
          {
            field: "date",
            headerName: "Date",
            width: 120,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => moment(params.row.date).format("DD MMMM YYYY")
          },
          {
            field: "courseFee",
            headerName: "Course Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.studentLearningToken.courseFeeValue,
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          },
          {
            field: "transportFee",
            headerName: "Transport Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.studentLearningToken.transportFeeValue,
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          },
          {
            field: "isPaid",
            headerName: "Is Paid",
            type: "boolean",
            width: 125,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "note",
            headerName: "Notes",
            width: 350
          }
        ]}
        tableMenu={[
          {
            type: "select",
            data: studentData,
            field: "students",
            getOptionLabel: (option) => getFullNameFromStudent(option),
            md: 6,
            lg: 3,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.student.studentId === val.studentId;
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
            lg: 3,
            filterHandler: (data, value) => {
              for (const val of value) {
                const result = data.teacher.teacherId === val.teacherId;
                if (result) return true;
              }
              return false;
            }
          },
          {
            type: "text-input",
            field: "instrument-grade",
            columnLabel: "Course",
            md: 8,
            lg: 4,
            filterHandler: (data, value) => searchCourseNameByValue(value, data.class.course)
          },
          {
            type: "select",
            data: [true, false],
            field: "isPaid",
            getOptionLabel: (option) => (option ? "Yes" : "No"),
            md: 4,
            lg: 2,
            filterHandler: (data, value) => {
              console.log(value);
              for (const val of value) {
                const result = data.isPaid === val;
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

export default PageAdminAttendanceTable;
