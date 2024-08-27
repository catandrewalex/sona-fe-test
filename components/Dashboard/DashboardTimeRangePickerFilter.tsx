import { Box, Divider, Grid2Props } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import StandardDatePicker from "@sonamusica-fe/components/Form/StandardDatePicker";
import { DatePickerProps } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useDebouncedCallback } from "@sonamusica-fe/utils/LodashUtil";

interface DashboardTimeRangePickerProps {
  gridProps?: Grid2Props;
  subjectLabel?: string;
  startPickerProps?: DatePickerProps<Moment> & { required?: boolean };
  endPickerProps?: DatePickerProps<Moment> & { required?: boolean };
  onTimeRangeChange: (startDate: Moment, endDate: Moment) => void;
}

const DashboardTimeRangePickerFilter = ({
  gridProps,
  subjectLabel,
  startPickerProps,
  endPickerProps,
  onTimeRangeChange
}: DashboardTimeRangePickerProps): JSX.Element => {
  const [startDate, setStartDate] = useState<Moment>(
    startPickerProps?.defaultValue || moment().subtract({ year: 1 })
  );
  const [endDate, setEndDate] = useState<Moment>(endPickerProps?.defaultValue || moment());
  const [hasErrorStartDate, setHasErrorStartDate] = useState<boolean>(false);
  const [hasErrorEndDate, setHasErrorEndDate] = useState<boolean>(false);
  const [startDateDefaultValue, setStartDateDefaultValue] = useState<Moment>(
    moment().subtract({ year: 1 })
  );
  const [endDateDefaultValue, setEndDateDefaultValue] = useState<Moment>(
    endPickerProps?.defaultValue || moment()
  );

  const onChangeDebounceCallback = useDebouncedCallback(
    (startDate: Moment, endDate: Moment, hasError: boolean) => {
      if (!hasError) {
        onTimeRangeChange(startDate, endDate);
      }
    },
    800
  );

  useEffect(() => {
    onChangeDebounceCallback(startDate, endDate, hasErrorStartDate || hasErrorEndDate);
  }, [startDate, endDate, hasErrorStartDate, hasErrorEndDate, onChangeDebounceCallback]);

  return (
    <Grid2 {...gridProps}>
      <Box component={"fieldset"}>
        <legend>{subjectLabel || "Time Range Filter"}</legend>
        {/*<Button*/}
        {/*  // onClick={onSelectAllClick}*/}
        {/*  size={"small"}*/}
        {/*  startIcon={<CheckBoxIcon />}*/}
        {/*  sx={{ mr: 1, mb: 1 }}*/}
        {/*  variant={"outlined"}*/}
        {/*>*/}
        {/*  Check All*/}
        {/*</Button>*/}
        <Divider />
        <Grid2 container direction={"column"}>
          <Grid2>
            <StandardDatePicker
              {...startPickerProps}
              onChange={(value) => {
                if (value && value.isValid()) {
                  setStartDate(value);

                  let validatedEndDate = endDate;
                  if (validatedEndDate < value) {
                    validatedEndDate = value.clone().startOf("month");
                  }
                  if (!validatedEndDate.isSame(endDate)) {
                    setEndDateDefaultValue(validatedEndDate);
                    setEndDate(validatedEndDate);
                  }
                }
              }}
              defaultValue={startDateDefaultValue}
              markError={setHasErrorStartDate}
            />
          </Grid2>
          <Grid2>
            <StandardDatePicker
              {...endPickerProps}
              onChange={(value) => {
                if (value && value.isValid()) {
                  setEndDate(value);

                  let validatedStartDate = startDate;

                  if (validatedStartDate > value) {
                    validatedStartDate = value.clone().startOf("month");
                  }
                  if (!validatedStartDate.isSame(startDate)) {
                    setStartDateDefaultValue(validatedStartDate);
                    setStartDate(validatedStartDate);
                  }
                }
              }}
              markError={setHasErrorEndDate}
              defaultValue={endDateDefaultValue}
            />
          </Grid2>
        </Grid2>
      </Box>
    </Grid2>
  );
};

export default DashboardTimeRangePickerFilter;
