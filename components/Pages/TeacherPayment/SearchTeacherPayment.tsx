import { Box, Card, CardContent, Typography } from "@mui/material";
import { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import moment from "moment";
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

const SearchTeacherPayment = () => {
  const apiTransformer = useApiTransformer();
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
        // const response = await API.SearchPayments({
        //   startDateTime: convertMomentDateToRFC3339(startDate),
        //   endDateTime: convertMomentDateToRFC3339(endDate)
        // });
        // const parsedResponse = apiTransformer(response, false);
        // if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
        //   return parsedResponse as FailedResponse;
        // } else {
        //   onSearchSubmit((parsedResponse as ResponseMany<EnrollmentPayment>).results);
        // }
      }
    },
    { month: monthOptions[moment().month() - 1], year: moment().year() }
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
