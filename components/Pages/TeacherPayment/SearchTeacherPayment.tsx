import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { TeacherPaymentPaidListItem, TeacherPaymentUnpaidListItem } from "@sonamusica-fe/types";
import { FailedResponse, ResponseMany } from "api";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";

const monthOptions = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "Desember" }
];

type SearchTeacherPaymentFormData = {
  month: { id: number; name: string };
  year: number;
};

interface SearchTeacherPaymentProps {
  onSearchComplete: (data: TeacherPaymentUnpaidListItem[] | TeacherPaymentPaidListItem[]) => void;
  isEdit?: boolean;
}

const SearchTeacherPayment = ({
  onSearchComplete,
  isEdit
}: SearchTeacherPaymentProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { push, replace } = useRouter();

  const yearOptions: number[] = [];
  for (let now = moment().year(), i = now - 10; i <= now + 10; i++) {
    yearOptions.push(i);
  }
  const { formRenderer } = useFormRenderer<SearchTeacherPaymentFormData>(
    {
      disableUseOfDefaultFormConfig: true,
      disablePromptCancelButtonDialog: true,
      submitContainerProps: {
        align: "center"
      },
      submitButtonProps: {
        md: 10,
        lg: 8,
        xl: 8,
        submitText: "Search"
      },
      fields: [
        {
          type: "select",
          label: "Month",
          validations: [],
          name: "month",
          formFieldProps: { md: 12, lg: 12 },
          selectProps: {
            options: monthOptions,
            getOptionLabel: (option) => option.name,
            isOptionEqualToValue: (option, value) => option.id === value.id
          }
        },
        {
          type: "select",
          label: "Year",
          validations: [],
          name: "year",
          formFieldProps: { md: 12, lg: 12 },
          selectProps: {
            options: yearOptions,
            getOptionLabel: (option) => option.toString()
          }
        }
      ],
      submitHandler: async ({ month, year }, err) => {
        if (err.month || err.year) return Promise.reject();
        const payload = {
          month: month?.id,
          year
        };
        const request = isEdit
          ? API.GetPaidTeacherPaymentByMonthAndYear
          : API.GetUnpaidTeacherPaymentByMonthAndYear;
        const response = await request(payload);
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          onSearchComplete((parsedResponse as ResponseMany<TeacherPaymentUnpaidListItem>).results);

          await replace({ query: { result: true, month: month?.id, year } });
        }
      }
    },
    { month: monthOptions[moment().month()], year: moment().year() }
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh"
      }}
    >
      <Card sx={{ height: "fit-content", width: "350px", p: 2 }} elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" sx={{ mb: 5 }}>
            Search {isEdit ? "Paid" : "Unpaid"} Teachers
          </Typography>
          {formRenderer()}
        </CardContent>
      </Card>
      <Button
        sx={{ mt: 1 }}
        startIcon={!isEdit ? <EditIcon /> : <AddIcon />}
        size="small"
        onClick={() =>
          push({
            pathname: !isEdit ? "/teacher-payment/edit" : "/teacher-payment"
          })
        }
        variant="text"
      >
        <small>{!isEdit ? "Edit" : "Create"} Teacher Payment</small>
      </Button>
    </Box>
  );
};

export default SearchTeacherPayment;
