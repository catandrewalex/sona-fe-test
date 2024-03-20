import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Course } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";
import {
  convertNumberToCurrencyString,
  getCourseName,
  searchCourseNameByValue
} from "@sonamusica-fe/utils/StringUtil";

type PageAdminCourseTableProps = {
  data: Course[];
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
  setData
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
                  content: `Are you sure to delete ${getCourseName(row)}?`
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
            valueGetter: (params) => getCourseName(params.row)
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
            width: 165,
            align: "center",
            headerAlign: "center"
          }
        ]}
        tableMenu={[
          {
            type: "text-input",
            field: "instrument-grade",
            columnLabel: "Instrument or Grade",
            md: 12,
            lg: 12,
            filterHandler: (data, value) => searchCourseNameByValue(value, data as Course)
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminCourseTable;
