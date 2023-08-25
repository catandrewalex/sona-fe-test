import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import { convertMomentDateToRFC3339 } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import moment, { Moment } from "moment";
import React, { useState } from "react";

type SearchPaymentListFormData = {
  startDate: Moment;
  endDate: Moment;
};

type SearchEnrollmentPaymentProps = {
  onSearchSubmit: (data: EnrollmentPayment[]) => void;
};

const SearchEnrollmentPayment = ({ onSearchSubmit }: SearchEnrollmentPaymentProps): JSX.Element => {
  const [startDate, setStartDate] = useState<Moment | null>(moment().startOf("month"));
  const [endDate, setEndDate] = useState<Moment | null>(moment());
  const apiTransformer = useApiTransformer();
  const { formRenderer } = useFormRenderer<SearchPaymentListFormData>(
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
          type: "date",
          label: "Start Date",
          validations: [],
          name: "startDate",
          formFieldProps: { md: 12, lg: 12 },
          dateProps: {
            defaultValue: startDate,
            onChange(value) {
              if (value && value.isValid()) {
                if (endDate && moment(endDate).subtract(1, "year").diff(value) > 0) {
                  setEndDate(moment(value).add(1, "year"));
                } else if (endDate && moment(endDate).diff(value) < 0) {
                  if (moment().diff(moment(value).add(1, "year")) < 0) {
                    setEndDate(moment());
                  } else {
                    setEndDate(moment(value).add(1, "year"));
                  }
                }
              }
              setStartDate(value);
            }
          }
        },
        {
          type: "date",
          label: "End Date",
          validations: [],
          name: "endDate",
          formFieldProps: { md: 12, lg: 12 },
          dateProps: {
            defaultValue: endDate,
            onChange(value) {
              if (value && value.isValid()) {
                if (startDate && moment(startDate).diff(value) > 0) {
                  setStartDate(moment(value).subtract(1, "year"));
                } else if (startDate && moment(value).subtract(1, "year").diff(startDate) > 0) {
                  setStartDate(moment(value).subtract(1, "year"));
                }
              }
              setEndDate(value);
            }
          }
        }
      ],
      submitHandler: async ({ startDate, endDate }, err) => {
        if (err.startDate || err.endDate) return Promise.reject();
        const response = await API.SearchPayments({
          startDateTime: convertMomentDateToRFC3339(startDate),
          endDateTime: convertMomentDateToRFC3339(endDate)
        });
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          onSearchSubmit((parsedResponse as ResponseMany<EnrollmentPayment>).results);
        }
      }
    },
    { startDate: moment().startOf("month"), endDate: moment() }
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
            Search Payment List
          </Typography>
          {formRenderer()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchEnrollmentPayment;
