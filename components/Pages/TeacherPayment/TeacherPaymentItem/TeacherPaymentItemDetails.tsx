import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { TeacherPaymentInvoiceItemAttendance } from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  convertNumberToPercentage
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";

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
  return (
    <Box sx={{ width: drawerOpen ? "calc(100vw - 400px)" : "calc(100vw - 150px)" }}>
      <DataGrid
        sx={{ width: "100%", overflowX: "auto" }}
        rows={data}
        columns={[
          {
            field: "date",
            valueGetter(params) {
              return moment(params.value).unix();
            },
            width: 150,
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
            field: "usedStudentTokenQuota",
            type: "number",
            headerName: "Quota Used",
            width: 70,
            headerAlign: "center",
            align: "center",
            sortable: false,
            disableColumnMenu: true,
            headerClassName: "header-break"
          },
          {
            field: "duration",
            type: "number",
            headerName: "Duration (min)",
            width: 80,
            headerAlign: "center",
            align: "center",
            sortable: false,
            disableColumnMenu: true,
            headerClassName: "header-break"
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
            width: 130,
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
            width: 130,
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
            editable: true
          },
          {
            field: "courseFeeSharingPercentage",
            type: "number",
            headerName: "Percentage Course Fee",
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
            editable: true
          },
          {
            field: "paidTransportFeeValue",
            type: "number",
            headerName: "Paid Transport Fee",
            width: 130,
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
            editable: true
          },
          {
            field: "transportFeeSharingPercentage",
            type: "number",
            headerName: "Percentage Transport Fee",
            width: 100,
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
          if (
            originalRow.paidCourseFeeValue !== updatedRow.paidCourseFeeValue &&
            updatedRow.paidCourseFeeValue !== undefined
          ) {
            if (updatedRow.paidCourseFeeValue > updatedRow.grossCourseFeeValue) {
              showSnackbar("Paid Course Fee can not bigger than Gross Course Fee!", "error");
            } else {
              updatedRow.courseFeeSharingPercentage =
                updatedRow.paidCourseFeeValue / updatedRow.grossCourseFeeValue;

              handleSubmitDataChange(
                updatedRow.attendanceId,
                updatedRow.paidCourseFeeValue
                  ? updatedRow.paidCourseFeeValue
                  : updatedRow.grossCourseFeeValue * updatedRow.courseFeeSharingPercentage,
                updatedRow.paidTransportFeeValue
                  ? updatedRow.paidTransportFeeValue
                  : updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage
              );
              return updatedRow;
            }
          } else if (
            originalRow.courseFeeSharingPercentage !== updatedRow.courseFeeSharingPercentage &&
            updatedRow.courseFeeSharingPercentage !== undefined
          ) {
            if (updatedRow.courseFeeSharingPercentage > 100) {
              showSnackbar("Percentage Course Fee can not bigger than 100%!", "error");
            } else {
              updatedRow.paidCourseFeeValue =
                (updatedRow.grossCourseFeeValue * updatedRow.courseFeeSharingPercentage) / 100;
              updatedRow.courseFeeSharingPercentage = updatedRow.courseFeeSharingPercentage / 100;

              handleSubmitDataChange(
                updatedRow.attendanceId,
                updatedRow.paidCourseFeeValue
                  ? updatedRow.paidCourseFeeValue
                  : updatedRow.grossCourseFeeValue * updatedRow.courseFeeSharingPercentage,
                updatedRow.paidTransportFeeValue
                  ? updatedRow.paidTransportFeeValue
                  : updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage
              );
              return updatedRow;
            }
          } else if (
            originalRow.transportFeeSharingPercentage !==
              updatedRow.transportFeeSharingPercentage &&
            updatedRow.transportFeeSharingPercentage !== undefined
          ) {
            if (updatedRow.transportFeeSharingPercentage > 100) {
              showSnackbar("Percentage Transport Fee can not bigger than 100%!", "error");
            } else {
              updatedRow.paidTransportFeeValue =
                (updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage) /
                100;
              updatedRow.transportFeeSharingPercentage =
                updatedRow.transportFeeSharingPercentage / 100;

              handleSubmitDataChange(
                updatedRow.attendanceId,
                updatedRow.paidCourseFeeValue
                  ? updatedRow.paidCourseFeeValue
                  : updatedRow.grossCourseFeeValue * updatedRow.transportFeeSharingPercentage,
                updatedRow.paidTransportFeeValue
                  ? updatedRow.paidTransportFeeValue
                  : updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage
              );
              return updatedRow;
            }
          } else if (
            originalRow.paidTransportFeeValue !== updatedRow.paidTransportFeeValue &&
            updatedRow.paidTransportFeeValue !== undefined
          ) {
            if (updatedRow.paidTransportFeeValue > updatedRow.grossTransportFeeValue) {
              showSnackbar("Paid Transport Fee can not bigger than Gross Transport Fee!", "error");
            } else {
              updatedRow.transportFeeSharingPercentage =
                updatedRow.paidTransportFeeValue / updatedRow.grossTransportFeeValue;

              handleSubmitDataChange(
                updatedRow.attendanceId,
                updatedRow.paidCourseFeeValue
                  ? updatedRow.paidCourseFeeValue
                  : updatedRow.grossCourseFeeValue * updatedRow.courseFeeSharingPercentage,
                updatedRow.paidTransportFeeValue
                  ? updatedRow.paidTransportFeeValue
                  : updatedRow.grossTransportFeeValue * updatedRow.transportFeeSharingPercentage
              );
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
