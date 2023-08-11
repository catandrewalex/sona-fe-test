import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { TeacherSpecialFee, Teacher, Course } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import {
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromTeacher,
  searchCourseNameByValue
} from "@sonamusica-fe/utils/StringUtil";

type PageAdminTeacherSpecialFeeTableProps = {
  data: TeacherSpecialFee[];
  teacherData: Teacher[];
  setSelectedData: (newSelectedData?: TeacherSpecialFee) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: TeacherSpecialFee[]) => void;
};

const PageAdminTeacherSpecialFeeTable = ({
  data,
  teacherData,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData
}: PageAdminTeacherSpecialFeeTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer testIdContext="AdminTeacherSpecialFee">
      <Table
        name="Teacher Special Fee"
        testIdContext="AdminTeacherSpecialFee"
        loading={loading}
        getRowId={(row) => row.teacherSpecialFeeId}
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        rows={data}
        columns={[
          useTableActions({
            editHandler: ({ id }) => {
              setSelectedData(data.filter((val) => val.teacherSpecialFeeId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Teacher Special Fee",
                  content: `Are you sure want to delete ${getFullNameFromTeacher(
                    row.teacher
                  )} special fee on ${getCourseName(row.course)}?`
                },
                () => {
                  setLoading(true);
                  API.DeleteTeacherSpecialFee([{ teacherSpecialFeeId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.teacherSpecialFeeId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "teacherSpecialFeeId",
            headerName: "ID",
            width: 100,
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
            field: "fee",
            headerName: "Fee",
            width: 140,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.fee,
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          }
        ]}
        tableMenu={[
          {
            type: "select",
            data: teacherData,
            field: "teacher",
            getOptionLabel: (option) => getFullNameFromTeacher(option),
            md: 6,
            lg: 6,
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
            field: "course",
            columnLabel: "Course",
            md: 6,
            lg: 6,
            filterHandler: (data, value) => searchCourseNameByValue(value, data.course)
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminTeacherSpecialFeeTable;
