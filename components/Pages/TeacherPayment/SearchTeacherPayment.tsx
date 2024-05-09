import { Box, Card, CardContent, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { TeacherPaymentUnpaidListItem } from "@sonamusica-fe/types";
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
  onSearchComplete: (data: TeacherPaymentUnpaidListItem[]) => void;
}

const SearchTeacherPayment = ({ onSearchComplete }: SearchTeacherPaymentProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { replace } = useRouter();

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
          validations: [{ name: "required" }],
          name: "month",
          formFieldProps: { md: 12, lg: 12 },
          inputProps: { required: true },
          selectProps: {
            options: monthOptions,
            getOptionLabel: (option) => option.name
          }
        },
        {
          type: "select",
          label: "Year",
          validations: [{ name: "required" }],
          name: "year",
          formFieldProps: { md: 12, lg: 12 },
          inputProps: { required: true },
          selectProps: {
            options: yearOptions,
            getOptionLabel: (option) => option.toString()
          }
        }
      ],
      submitHandler: async ({ month, year }, err) => {
        if (err.month || err.year) return Promise.reject();
        const response = await API.GetUnpaidTeacherPaymentByMonthAndYear({ month: month.id, year });
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          onSearchComplete((parsedResponse as ResponseMany<TeacherPaymentUnpaidListItem>).results);

          replace({ query: { month: month.id, year } });
        }
      }
    },
    { month: monthOptions[moment().month()], year: moment().year() }
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh"
      }}
    >
      <Card sx={{ height: "fit-content", width: "350px", p: 2 }} elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" sx={{ mb: 5 }}>
            Search Teacher Payment
          </Typography>
          {formRenderer()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchTeacherPayment;
