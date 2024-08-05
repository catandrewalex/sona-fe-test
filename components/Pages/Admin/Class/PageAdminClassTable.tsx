import { Button, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import useModalRenderer from "@sonamusica-fe/components/Modal/ModalRenderer";
import StudentColumnRenderer from "@sonamusica-fe/components/Pages/Admin/Class/StudentColumnRenderer";
import { MemoizedTable, TableMenuConfig } from "@sonamusica-fe/components/Table";
import createTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import { MemoizedTableContainer } from "@sonamusica-fe/components/Table/TableContainer";
import { Class, Student } from "@sonamusica-fe/types";
import {
  advancedNumberFilter,
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher,
  searchCourseNameByValue,
  searchFullNameByValue
} from "@sonamusica-fe/utils/StringUtil";
import React, { useCallback, useMemo, useState } from "react";

type PageAdminClassTableProps = {
  data: Class[];
  studentData: Student[];
  setSelectedData: (newSelectedData?: Class) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: Class[]) => void;
};

const PageAdminClassTable = ({
  data,
  setSelectedData,
  openModal,
  loading,
  studentData
}: PageAdminClassTableProps): JSX.Element => {
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Class>();
  const { openModal: openModalStudentDetail, ModalRenderer } = useModalRenderer({
    onClose: () => setSelectedStudentDetail(undefined),
    closeIcon: true,
    minWidth: "30vw",
    maxWidth: "75vw"
  });

  return (
    <>
      {/* We need memoized TableContainer & Table due to need of displaying several "students" using modal.
    The memoized versions are useful for preventing whole-table rerender when we're opening/closing the "students" modal. */}
      <MemoizedTableContainer testIdContext="AdminClass">
        <MemoizedTable
          name="Class"
          testIdContext="AdminClass"
          loading={loading}
          getRowId={useCallback((row) => row.classId, [])}
          getRowClassNameAddition={useCallback(
            (params) => (params.row.isDeactivated ? "deactivated-row" : "default"),
            []
          )}
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={openModal}
          rows={data}
          columns={useMemo((): GridColDef[] => {
            return [
              createTableActions({
                editHandler: ({ id }) => {
                  setSelectedData(data.filter((val) => val.classId === id)[0]);
                  openModal();
                },
                deleteDisableMessage:
                  "Class deletion is disabled. You can deactivate this class instead."
              }),
              {
                field: "classId",
                headerName: "ID",
                width: 70,
                align: "center",
                headerAlign: "center"
              },
              {
                field: "teacher",
                headerName: "Teacher",
                flex: 2,
                valueGetter: (params) => getFullNameFromTeacher(params.row.teacher)
              },
              {
                field: "instrument-grade",
                headerName: "Course",
                flex: 2,
                valueGetter: (params) => getCourseName(params.row.course)
              },
              {
                field: "students",
                headerName: "Student(s)",
                flex: 3,
                renderCell: (params) => (
                  <StudentColumnRenderer
                    students={params.row.students}
                    detailClickHandler={() => {
                      setSelectedStudentDetail(params.row);
                      openModalStudentDetail();
                    }}
                  />
                )
              },
              {
                field: "teacherSpecialFee",
                headerName: "Teacher Special Fee",
                width: 140,
                align: "center",
                headerAlign: "center",
                valueGetter: (params) => params.row.teacherSpecialFee ?? 0,
                valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
              },
              {
                field: "defaultFee",
                headerName: "Fee",
                width: 140,
                align: "center",
                headerAlign: "center",
                valueGetter: (params) => params.row.course.defaultFee,
                valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
              },
              {
                field: "transportFee",
                headerName: "Transport Fee",
                width: 140,
                align: "center",
                headerAlign: "center",
                valueGetter: (params) => params.row.transportFee,
                valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
              },
              {
                field: "defaultDurationMinute",
                headerName: "Duration (Minute)",
                width: 165,
                align: "center",
                headerAlign: "center",
                valueGetter: (params) => params.row.course.defaultDurationMinute
              }
            ];
          }, [data, openModal, setSelectedData, setSelectedStudentDetail, openModalStudentDetail])}
          tableMenu={useMemo((): TableMenuConfig[] => {
            return [
              {
                type: "text-input",
                field: "teacher",
                xs: 6,
                md: 4,
                lg: 4,
                filterHandler: (data, value) => searchFullNameByValue(value, data.teacher?.user)
              },
              {
                type: "text-input",
                field: "instrument-grade",
                columnLabel: "Course",
                xs: 6,
                md: 4,
                lg: 4,
                filterHandler: (data, value) => searchCourseNameByValue(value, data.course)
              },
              {
                type: "select",
                data: studentData,
                field: "students",
                getOptionLabel: (option) => getFullNameFromStudent(option),
                xs: 6,
                md: 4,
                lg: 4,
                filterHandler: (data, value) => {
                  for (const val of value) {
                    const result = (data.students as Student[]).filter(
                      (student) => student.studentId === val.studentId
                    );
                    if (result.length > 0) return true;
                  }
                  return false;
                }
              },
              {
                type: "text-input",
                field: "teacherSpecialFee",
                columnLabel: "Teacher Special Fee",
                helperText: "Equality signs can be used (<=700000, >100000, 375000, etc.)",
                xs: 6,
                md: 4,
                lg: 4,
                filterHandler: (data, value) =>
                  advancedNumberFilter(data.teacherSpecialFee, value.trim())
              },
              {
                type: "text-input",
                field: "defaultFee",
                columnLabel: "Fee",
                helperText: "Equality signs can be used (<=700000, >100000, 375000, etc.)",
                xs: 6,
                md: 4,
                lg: 4,
                filterHandler: (data, value) =>
                  advancedNumberFilter(data.course.defaultFee, value.trim())
              },
              {
                type: "text-input",
                field: "defaultDurationMinute",
                columnLabel: "Duration",
                helperText: "Equality signs can be used (<60, >=45, 30, etc.)",
                xs: 6,
                md: 4,
                lg: 4,
                filterHandler: (data, value) =>
                  advancedNumberFilter(data.course.defaultDurationMinute, value.trim())
              }
            ];
          }, [studentData])}
        />
      </MemoizedTableContainer>

      {selectedStudentDetail && (
        <ModalRenderer>
          <Typography variant="h5" sx={{ mb: 2 }}>
            #{selectedStudentDetail.classId} {getCourseName(selectedStudentDetail.course)} (by{" "}
            {getFullNameFromTeacher(selectedStudentDetail.teacher)})
          </Typography>
          <Typography variant="body1">Students:</Typography>
          <ol style={{ marginTop: 0 }}>
            {selectedStudentDetail.students.map((student) => (
              <li key={student.studentId}>{getFullNameFromStudent(student)}</li>
            ))}
          </ol>
        </ModalRenderer>
      )}
    </>
  );
};

export default PageAdminClassTable;
