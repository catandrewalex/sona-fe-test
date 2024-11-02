import DashboardTimeRangePickerFilter from "@sonamusica-fe/components/Dashboard/DashboardTimeRangePickerFilter";
import moment from "moment/moment";
import DashboardSubjectFilter from "@sonamusica-fe/components/Dashboard/DashboardSubjectFilter";
import { IncomeDashboardOverviewRequestBody, Instrument } from "@sonamusica-fe/types";
import DashboardFilterContainer from "@sonamusica-fe/components/Dashboard/DashboardFilterContainer";
import { DatePickerProps } from "@mui/x-date-pickers";
import { Moment } from "moment";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { FailedResponse, ResponseMany, SuccessResponse } from "../../../../api";

const defaultPickerProps: DatePickerProps<Moment> & { required?: boolean } = {
  required: true,
  views: ["month", "year"],
  closeOnSelect: true
};

interface IncomeFilterProps {
  onFilterChange: Dispatch<SetStateAction<IncomeDashboardOverviewRequestBody | undefined>>;
  markFirstVisit: () => void;
}

const IncomesFilter = React.memo(
  ({ onFilterChange, markFirstVisit }: IncomeFilterProps): JSX.Element => {
    const [instruments, setInstruments] = useState<Instrument[]>([]);

    const apiTransformer = useApiTransformer();
    const { showSnackbar } = useSnack();

    const getDefaultFilterState = useCallback((instruments: Instrument[]) => {
      const defaultStartDate = moment().subtract({ year: 1 });
      const defaultEndDate = moment();

      return {
        instrumentIds: instruments.map((instrument) => instrument.instrumentId),
        dateRange: {
          startDate: { month: defaultStartDate.month() + 1, year: defaultStartDate.year() },
          endDate: { month: defaultEndDate.month() + 1, year: defaultEndDate.year() }
        }
      };
    }, []);

    useEffect(() => {
      const promises = [API.GetInstrumentForDashboardOptions()];
      Promise.allSettled(promises)
        .then((value) => {
          let instrumentsTemp: Instrument[] = [];
          if (value[0].status === "fulfilled") {
            const response = value[0].value as SuccessResponse<Instrument>;
            const parsedResponse = apiTransformer(response, false);
            if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
              instrumentsTemp = (parsedResponse as ResponseMany<Instrument>).results;
              setInstruments(instrumentsTemp);
            }
          } else {
            showSnackbar("Failed to fetch instruments data!", "error");
          }
          onFilterChange(() => getDefaultFilterState(instrumentsTemp));
        })
        .finally(() => {
          markFirstVisit();
        });
    }, []);

    const getInstrumentOptionLabel = useCallback((option: Instrument) => {
      return option.name;
    }, []);

    const getSubjectIdFromInstrument = useCallback((subject: Instrument) => {
      return subject.instrumentId.toString();
    }, []);

    return (
      <DashboardFilterContainer>
        <DashboardTimeRangePickerFilter
          gridProps={{ sm: 12, md: 4, xl: 2 }}
          subjectLabel="Time Range"
          startPickerProps={{
            ...defaultPickerProps,
            label: "Start",
            defaultValue: moment().subtract({ month: 12 })
          }}
          endPickerProps={{
            ...defaultPickerProps,
            label: "End",
            defaultValue: moment()
          }}
          onTimeRangeChange={(startDate, endDate) => {
            onFilterChange((prev) => ({
              ...(prev ? prev : getDefaultFilterState(instruments)),
              dateRange: {
                startDate: { month: startDate.month() + 1, year: startDate.year() },
                endDate: { month: endDate.month() + 1, year: endDate.year() }
              }
            }));
          }}
        />
        <DashboardSubjectFilter<Instrument>
          options={instruments}
          getOptionLabel={getInstrumentOptionLabel}
          gridProps={{ sm: 12, md: 4, xl: 5 }}
          subjectLabel="Instrument Filter"
          getSubjectId={getSubjectIdFromInstrument}
          onChange={(value) => {
            onFilterChange((prev) => ({
              ...(prev ? prev : getDefaultFilterState(instruments)),
              instrumentIds: value.map((instrument) => instrument.instrumentId)
            }));
          }}
        />
      </DashboardFilterContainer>
    );
  }
);

export default IncomesFilter;
