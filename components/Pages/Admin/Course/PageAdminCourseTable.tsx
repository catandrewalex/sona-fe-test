import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Course, Grade, Instrument } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import {
  advancedNumberFilter,
  convertNumberToCurrencyString
} from "@sonamusica-fe/utils/StringUtil";

type PageAdminCourseTableProps = {
  data: Course[];
  gradeData: Grade[];
  instrumentData: Instrument[];
  setSelectedData: (newSelectedData?: Course) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: Course[]) => void;
};

const PageAdminCourseTable = ({
  data,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData,
  instrumentData,
  gradeData
}: PageAdminCourseTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer testIdContext="AdminCourse">
      <Table
        name="Course"
        testIdContext="AdminCourse"
        loading={loading}
        getRowId={(row) => row.courseId}
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        rows={data}
        columns={[
          useTableActions({
            editHandler: ({ id }) => {
              setSelectedData(data.filter((val) => val.courseId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Course",
                  content: `Are you sure want to delete ${row.grade.name} - ${row.instrument.name}?`
                },
                () => {
                  setLoading(true);
                  API.DeleteCourse([{ courseId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.courseId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "courseId",
            headerName: "ID",
            width: 100,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "instrument-grade",
            headerName: "Instrument - Grade",
            flex: 1,
            valueGetter: (params) => params.row.instrument.name + " - " + params.row.grade.name
          },
          {
            field: "defaultFee",
            headerName: "Fee",
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueFormatter: (params) => `${convertNumberToCurrencyString(params.value)}`
          },
          {
            field: "defaultDurationMinute",
            headerName: "Duration (Minute)",
            width: 175,
            align: "center",
            headerAlign: "center"
          }
        ]}
        tableMenu={[
          {
            type: "text-input",
            field: "instrument-grade",
            columnLabel: "Instrument or Grade",
            md: 4,
            lg: 4,
            filterHandler: (data, value) =>
              data.grade.name.toLowerCase().includes(value.toLowerCase()) ||
              data.instrument.name.toLowerCase().includes(value.toLowerCase()) ||
              `${data.instrument.name} - ${data.grade.name}`
                .toLowerCase()
                .includes(value.toLowerCase())
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
  );
};

export default PageAdminCourseTable;
