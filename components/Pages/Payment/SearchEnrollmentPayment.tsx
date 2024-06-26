import AddIcon from "@mui/icons-material/Add";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import { convertMomentDateToRFC3339 } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import moment, { Moment, min, max } from "moment";
import { useRouter } from "next/router";
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
  const { push } = useRouter();
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
              setStartDate(value);
              if (value && value.isValid() && endDate) {
                let validatedEndDate = endDate;
                if (validatedEndDate < value) {
                  validatedEndDate = moment().endOf("month");
                }

                const maxValidEndDate = min([moment(), value.clone().add(1, "year")]);
                validatedEndDate = min([endDate, maxValidEndDate]);

                setEndDate(validatedEndDate);
              }
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
              setEndDate(value);
              if (value && value.isValid() && startDate) {
                let validatedStartDate = startDate;
                if (validatedStartDate > value) {
                  validatedStartDate = value.clone().startOf("month");
                } else {
                  const minValidStartDate = value.clone().subtract(1, "year");
                  validatedStartDate = max([startDate, minValidStartDate]);
                }

                setStartDate(validatedStartDate);
              }
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
            Search Payment List
          </Typography>
          {formRenderer()}
        </CardContent>
      </Card>
      <Button
        sx={{ mt: 1 }}
        startIcon={<AddIcon />}
        size="small"
        onClick={() =>
          push({
            pathname: "/payment/new"
          })
        }
        variant="text"
      >
        <small>Add Enrollment Payment</small>
      </Button>
    </Box>
  );
};

export default SearchEnrollmentPayment;
