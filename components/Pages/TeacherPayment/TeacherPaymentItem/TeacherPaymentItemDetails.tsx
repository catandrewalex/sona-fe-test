import { Box } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { TeacherPaymentInvoiceItemAttendance } from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  convertNumberToPercentage
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React, { useCallback } from "react";

type TeacherPaymentInvoiceItemAttendanceEditable = TeacherPaymentInvoiceItemAttendance & {
  paidCourseFeeValue?: number;
  courseFeeSharingPercentage?: number;
  paidTransportFeeValue?: number;
  transportFeeSharingPercentage?: number;
};

export interface TeacherPaymentItemDetailsProps {
  data: TeacherPaymentInvoiceItemAttendanceEditable[];
  handleSubmitDataChange: (
    attendanceId: number,
    paidCourseFeeValue: number,
    paidTransportFeeValue: number
  ) => void;
}

const TeacherPaymentItemDetails = ({
  data,
  handleSubmitDataChange
}: TeacherPaymentItemDetailsProps): JSX.Element => {
  const drawerOpen = useApp((state) => state.drawerOpen);
  const { showSnackbar } = useSnack();

  // we need this to colorize the editable cell (currently it is yellow)
  const renderEditableCell = useCallback((params: GridRenderCellParams) => {
    return (
      <Box
        sx={{
          backgroundColor: "rgba(255, 248, 140, 0.55)",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {params.formattedValue}
      </Box>
    );
  }, []);

  return (
    <Box sx={{ width: drawerOpen ? "calc(100vw - 340px)" : "calc(100vw - 150px)" }}>
      <DataGrid
        sx={{ width: "100%", overflowX: "auto", "& .MuiDataGrid-cell": { px: 0 } }}
        rows={data}
        columns={[
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
            valueGetter(params) {
              if (params.row.paidCourseFeeValue === undefined)
                return params.row.grossCourseFeeValue * params.row.courseFeeSharingPercentage;
              return params.value;
            },
            valueFormatter(params) {
              return convertNumberToCurrencyString(params.value);
            },
            renderCell: renderEditableCell,
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
            headerClassName: "header-break",
            valueGetter(params) {
              if (params.row.courseFeeSharingPercentage === undefined)
                return params.row.courseFeeSharingPercentage * 100;
              return params.value * 100;
            },
            valueFormatter(params) {
              return convertNumberToPercentage(params.value.toFixed(2), true);
            },
            renderCell: renderEditableCell,
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
            valueGetter(params) {
              if (params.row.paidTransportFeeValue === undefined)
                return params.row.grossTransportFeeValue * params.row.transportFeeSharingPercentage;
              return params.value;
            },
            valueFormatter(params) {
              return convertNumberToCurrencyString(params.value);
            },
            renderCell: renderEditableCell,
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
            valueGetter(params) {
              if (params.row.transportFeeSharingPercentage === undefined)
                return params.row.transportFeeSharingPercentage * 100;
              return params.value * 100;
            },
            valueFormatter(params) {
              return convertNumberToPercentage(params.value.toFixed(2), true);
            },
            renderCell: renderEditableCell,
            editable: true
          }
        ]}
        getRowId={(row) => row.attendanceId}
        sortModel={[{ field: "date", sort: "desc" }]}
        disableRowSelectionOnClick
        hideFooter
        initialState={{
          pagination: {
            paginationModel: { pageSize: 100, page: 0 }
          }
        }}
        processRowUpdate={(updatedRow, originalRow) => {
          console.log(updatedRow, originalRow);
          const invokeHandleSubmit = () => {
            handleSubmitDataChange(
              updatedRow.attendanceId,
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
            if (updatedRow.paidCourseFeeValue > updatedRow.grossCourseFeeValue) {
              showSnackbar("Paid Course Fee must be less than Gross Course Fee!", "error");
            } else if (updatedRow.paidCourseFeeValue < 0) {
              showSnackbar("Paid Course Fee must be greater than 0!", "error");
            } else {
              updatedRow.courseFeeSharingPercentage =
                updatedRow.paidCourseFeeValue / updatedRow.grossCourseFeeValue;
              invokeHandleSubmit();
              return updatedRow;
            }
          } else if (
            originalRow.courseFeeSharingPercentage !== updatedRow.courseFeeSharingPercentage &&
            updatedRow.courseFeeSharingPercentage !== undefined
          ) {
            if (updatedRow.courseFeeSharingPercentage > 100) {
              showSnackbar("Percentage Course Fee must be less than 100%!", "error");
            } else if (updatedRow.courseFeeSharingPercentage < 0) {
              showSnackbar("Percentange Course Fee must be greater than 0%!", "error");
            } else {
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
            if (updatedRow.transportFeeSharingPercentage > 100) {
              showSnackbar("Percentage Transport Fee must be less than 100%!", "error");
            } else if (updatedRow.transportFeeSharingPercentage < 0) {
              showSnackbar("Percentange Transport Fee must be greater than 0%!", "error");
            } else {
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
            if (updatedRow.paidTransportFeeValue > updatedRow.grossTransportFeeValue) {
              showSnackbar("Paid Transport Fee must be less than Gross Transport Fee!", "error");
            } else if (updatedRow.paidTransportFeeValue < 0) {
              showSnackbar("Paid Transport Fee must be greater than 0!", "error");
            } else {
              if (updatedRow.grossTransportFeeValue !== 0) {
                updatedRow.transportFeeSharingPercentage =
                  updatedRow.paidTransportFeeValue / updatedRow.grossTransportFeeValue;
              }
              invokeHandleSubmit();
              return updatedRow;
            }
          }
          return originalRow;
        }}
      />
    </Box>
  );
};

export default TeacherPaymentItemDetails;
