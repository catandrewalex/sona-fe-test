import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import {
  TeacherPaymentInvoiceItemAttendance,
  TeacherPaymentInvoiceItemAttendanceModify
} from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  convertNumberToPercentage
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";

export interface TeacherPaymentItemDetailsProps {
  data: Array<TeacherPaymentInvoiceItemAttendance | TeacherPaymentInvoiceItemAttendanceModify>;
  isEdit?: boolean;
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
  handleDeleteData: (teacherPaymentId: number, value: boolean) => void;
}

const TeacherPaymentItemDetails = ({
  data,
  isEdit,
  handleSubmitDataChange,
  handleDeleteData
}: TeacherPaymentItemDetailsProps): JSX.Element => {
  const drawerOpen = useApp((state) => state.drawerOpen);
  const { showSnackbar } = useSnack();

  let columns: GridColDef[] = [
    {
      field: "date",
      valueGetter(params) {
        return moment(params.value).unix();
      },
      width: 125,
      headerAlign: "center",
      align: "center",
      headerName: "Date",
      disableColumnMenu: true,
      sortable: false,
      valueFormatter(params) {
        return moment.unix(params.value).format("DD/MM/YYYY HH:mm");
      }
    },
    {
      field: "usedStudentTokenQuotaAndDuration",
      type: "number",
      headerName: "Quota Used (Duration)",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break",
      valueGetter(params) {
        return `${params.row.usedStudentTokenQuota} (${params.row.duration} min)`;
      }
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break"
    },
    {
      field: "grossCourseFeeValue",
      type: "number",
      headerName: "Gross Course Fee",
      width: 110,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break",
      valueFormatter(params) {
        return convertNumberToCurrencyString(params.value);
      }
    },
    {
      field: "paidCourseFeeValue",
      type: "number",
      headerName: "Paid Course Fee",
      width: 110,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break",
      cellClassName: "editable-cell",
      valueGetter(params) {
        if (params.row.paidCourseFeeValue === undefined)
          return params.row.grossCourseFeeValue * params.row.courseFeeSharingPercentage;
        return params.value;
      },
      valueFormatter(params) {
        return convertNumberToCurrencyString(params.value);
      },
      editable: true
    },
    {
      field: "courseFeeSharingPercentage",
      type: "number",
      headerName: "(%) Course Fee",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      cellClassName: "editable-cell",
      headerClassName: "header-break",
      valueGetter(params) {
        if (params.row.courseFeeSharingPercentage === undefined)
          return params.row.courseFeeSharingPercentage * 100;
        return params.value * 100;
      },
      valueFormatter(params) {
        return convertNumberToPercentage(params.value, 2);
      },
      editable: true
    },

    {
      field: "grossTransportFeeValue",
      type: "number",
      headerName: "Gross Transport Fee",
      width: 110,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break",
      valueFormatter(params) {
        return convertNumberToCurrencyString(params.value);
      }
    },
    {
      field: "paidTransportFeeValue",
      type: "number",
      headerName: "Paid Transport Fee",
      width: 110,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break",
      cellClassName: "editable-cell",
      valueGetter(params) {
        if (params.row.paidTransportFeeValue === undefined)
          return params.row.grossTransportFeeValue * params.row.transportFeeSharingPercentage;
        return params.value;
      },
      valueFormatter(params) {
        return convertNumberToCurrencyString(params.value);
      },
      editable: true
    },
    {
      field: "transportFeeSharingPercentage",
      type: "number",
      headerName: "(%) Transport Fee",
      width: 110,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-break",
      cellClassName: "editable-cell",
      valueGetter(params) {
        if (params.row.transportFeeSharingPercentage === undefined)
          return params.row.transportFeeSharingPercentage * 100;
        return params.value * 100;
      },
      valueFormatter(params) {
        return convertNumberToPercentage(params.value, 2);
      },
      editable: true
    }
  ];

  if (isEdit) {
    columns = (
      [
        {
          field: "isDeleted",
          type: "boolean",
          headerName: "Deleted",
          headerAlign: "center",
          headerClassName: "header-break",
          width: 80,
          editable: true,
          disableColumnMenu: true,
          sortable: false,
          align: "center" as const
        }
      ] as GridColDef[]
    ).concat(columns);
  }

  return (
    <Box sx={{ width: drawerOpen ? "calc(100vw - 340px)" : "calc(100vw - 150px)" }}>
      <DataGrid
        sx={{ width: "100%", overflowX: "auto", "& .MuiDataGrid-cell": { px: 0 } }}
        rows={data}
        columns={columns}
        getRowId={(row) => row.attendanceId}
        sortModel={[{ field: "date", sort: "desc" }]}
        disableRowSelectionOnClick
        hideFooter
        getRowClassName={(params) => (params.row.isDeleted ? "deleted-row" : "default")}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 100, page: 0 }
          }
        }}
        processRowUpdate={(updatedRow, originalRow) => {
          const invokeHandleSubmit = () => {
            handleSubmitDataChange(
              isEdit ? updatedRow.teacherPaymentId : updatedRow.attendanceId,
              updatedRow.paidCourseFeeValue
                ? updatedRow.paidCourseFeeValue
                : updatedRow.grossCourseFeeValue * updatedRow.courseFeeSharingPercentage,
              updatedRow.paidTransportFeeValue
                ? updatedRow.paidTransportFeeValue
                : updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage
            );
          };

          if (
            originalRow.paidCourseFeeValue !== updatedRow.paidCourseFeeValue &&
            updatedRow.paidCourseFeeValue !== undefined
          ) {
            if (updatedRow.paidCourseFeeValue < 0) {
              showSnackbar("Paid Course Fee must be greater than 0!", "error");
            } else {
              if (updatedRow.paidCourseFeeValue > updatedRow.grossCourseFeeValue) {
                showSnackbar(
                  "Paid Course Fee is greater than Gross Course Fee. Are you sure?",
                  "warning"
                );
              }
              if (updatedRow.grossCourseFeeValue !== 0) {
                updatedRow.courseFeeSharingPercentage =
                  updatedRow.paidCourseFeeValue / updatedRow.grossCourseFeeValue;
              }
              invokeHandleSubmit();
              return updatedRow;
            }
          } else if (
            originalRow.courseFeeSharingPercentage !== updatedRow.courseFeeSharingPercentage &&
            updatedRow.courseFeeSharingPercentage !== undefined
          ) {
            if (updatedRow.courseFeeSharingPercentage < 0) {
              showSnackbar("Percentage Course Fee must be greater than 0%!", "error");
            } else {
              if (updatedRow.courseFeeSharingPercentage > 100) {
                showSnackbar(
                  "Percentage Course Fee is greater than 100%. Are you sure?",
                  "warning"
                );
              }
              updatedRow.paidCourseFeeValue =
                (updatedRow.grossCourseFeeValue * updatedRow.courseFeeSharingPercentage) / 100;
              updatedRow.courseFeeSharingPercentage = updatedRow.courseFeeSharingPercentage / 100;
              invokeHandleSubmit();
              return updatedRow;
            }
          } else if (
            originalRow.transportFeeSharingPercentage !==
              updatedRow.transportFeeSharingPercentage &&
            updatedRow.transportFeeSharingPercentage !== undefined
          ) {
            if (updatedRow.transportFeeSharingPercentage < 0) {
              showSnackbar("Percentage Transport Fee must be greater than 0%!", "error");
            } else {
              if (updatedRow.transportFeeSharingPercentage > 100) {
                showSnackbar(
                  "Percentage Transport Fee is greater than 100%. Are you sure?",
                  "warning"
                );
              }
              updatedRow.paidTransportFeeValue =
                (updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage) /
                100;
              updatedRow.transportFeeSharingPercentage =
                updatedRow.transportFeeSharingPercentage / 100;
              invokeHandleSubmit();
              return updatedRow;
            }
          } else if (
            originalRow.paidTransportFeeValue !== updatedRow.paidTransportFeeValue &&
            updatedRow.paidTransportFeeValue !== undefined
          ) {
            if (updatedRow.paidTransportFeeValue < 0) {
              showSnackbar("Paid Transport Fee must be greater than 0!", "error");
            } else {
              if (updatedRow.paidTransportFeeValue > updatedRow.grossTransportFeeValue) {
                showSnackbar(
                  "Paid Transport Fee is greater than Gross Transport Fee. Are you sure?",
                  "warning"
                );
              }
              if (updatedRow.grossTransportFeeValue !== 0) {
                updatedRow.transportFeeSharingPercentage =
                  updatedRow.paidTransportFeeValue / updatedRow.grossTransportFeeValue;
              }
              invokeHandleSubmit();
              return updatedRow;
            }
          } else if (originalRow.isDeleted !== updatedRow.isDeleted) {
            handleDeleteData(updatedRow.teacherPaymentId, updatedRow.isDeleted);
            return updatedRow;
          }
          return originalRow;
        }}
      />
    </Box>
  );
};

export default TeacherPaymentItemDetails;
