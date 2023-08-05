import { Typography } from "@mui/material";
import useModalRenderer from "@sonamusica-fe/components/Modal/ModalRenderer";
import MemoizeStudentColumnRenderer from "@sonamusica-fe/components/Pages/Admin/Class/StudentColumnRenderer";
import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { Class, Student } from "@sonamusica-fe/types";
import {
  advancedNumberFilter,
  convertNumberToCurrencyString
} from "@sonamusica-fe/utils/StringUtil";
import React, { useState } from "react";

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
    maxWidth: "50vw"
  });

  return (
    <>
      <TableContainer testIdContext="AdminClass">
        <Table
          name="Class"
          testIdContext="AdminClass"
          loading={loading}
          getRowId={(row) => row.classId}
          getRowClassNameAddition={(params) =>
            params.row.isDeactivated ? "deactivated-row" : "default"
          }
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={openModal}
          rows={data}
          columns={[
            useTableActions({
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
              valueGetter: (params) =>
                params.row.teacher?.user?.userDetail?.firstName
                  ? (params.row.teacher?.user?.userDetail?.firstName || "") +
                    " " +
                    (params.row.teacher?.user?.userDetail?.lastName || "")
                  : "-"
            },
            {
              field: "instrument-grade",
              headerName: "Course",
              flex: 2,
              valueGetter: (params) =>
                params.row.course.instrument.name + " - " + params.row.course.grade.name
            },
            {
              field: "students",
              headerName: "Student(s)",
              flex: 3,
              renderCell: (params) => (
                <MemoizeStudentColumnRenderer
                  students={params.row.students}
                  detailClickHandler={() => {
                    setSelectedStudentDetail(params.row);
                    openModalStudentDetail();
                  }}
                />
              )
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
          ]}
          tableMenu={[
            {
              type: "text-input",
              field: "teacher",
              md: 6,
              lg: 4,
              filterHandler: (data, value) =>
                data.teacher &&
                (data.teacher.user.userDetail.firstName
                  .toLowerCase()
                  .includes(value.toLowerCase()) ||
                  data.teacher.user.userDetail.lastName
                    ?.toLowerCase()
                    ?.includes(value.toLowerCase()) ||
                  `${data.teacher.user.userDetail.firstName} ${
                    data.teacher.user.userDetail.lastName || ""
                  }`
                    .toLowerCase()
                    .includes(value.toLowerCase()))
            },
            {
              type: "text-input",
              field: "instrument-grade",
              columnLabel: "Course",
              md: 6,
              lg: 4,
              filterHandler: (data, value) =>
                data.course.grade.name.toLowerCase().includes(value.toLowerCase()) ||
                data.course.instrument.name.toLowerCase().includes(value.toLowerCase()) ||
                `${data.course.instrument.name} - ${data.course.grade.name}`
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
              field: "defaultFee",
              columnLabel: "Fee",
              helperText: "Equality signs can be used (<=700000, >100000, 375000, etc.)",
              md: 4,
              lg: 4,
              filterHandler: (data, value) => advancedNumberFilter(data.defaultFee, value.trim())
            },
            {
              type: "text-input",
              field: "defaultDurationMinute",
              columnLabel: "Duration",
              helperText: "Equality signs can be used (<60, >=45, 30, etc.)",
              md: 4,
              lg: 4,
              filterHandler: (data, value) =>
                advancedNumberFilter(data.defaultDurationMinute, value.trim())
            }
          ]}
        />
      </TableContainer>
      {selectedStudentDetail && (
        <ModalRenderer>
          <Typography variant="h5" sx={{ mb: 2 }}>
            #{selectedStudentDetail.classId} {selectedStudentDetail.course.instrument.name} -{" "}
            {selectedStudentDetail.course.grade.name}{" "}
            {selectedStudentDetail.teacher?.user?.userDetail?.firstName
              ? `(by ${selectedStudentDetail.teacher.user.userDetail.firstName} ${
                  selectedStudentDetail.teacher.user.userDetail.lastName || ""
                })`
              : ""}
          </Typography>
          <Typography variant="body1">Students:</Typography>
          <ol style={{ marginTop: 0 }}>
            {selectedStudentDetail.students.map((student) => (
              <li key={student.studentId}>
                {student.user.userDetail.firstName} {student.user.userDetail.lastName || ""}
              </li>
            ))}
          </ol>
        </ModalRenderer>
      )}
    </>
  );
};

export default PageAdminClassTable;
