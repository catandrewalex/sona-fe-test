import DashboardTimeRangePickerFilter from "@sonamusica-fe/components/Dashboard/DashboardTimeRangePickerFilter";
import moment from "moment/moment";
import DashboardSubjectFilter from "@sonamusica-fe/components/Dashboard/DashboardSubjectFilter";
import { ExpenseDashboardOverviewRequestBody, Instrument, Teacher } from "@sonamusica-fe/types";
import DashboardFilterContainer from "@sonamusica-fe/components/Dashboard/DashboardFilterContainer";
import { DatePickerProps } from "@mui/x-date-pickers";
import { Moment } from "moment";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { FailedResponse, ResponseMany, SuccessResponse } from "../../../../api";

const defaultPickerProps: DatePickerProps<Moment> & { required?: boolean } = {
  required: true,
  views: ["month", "year"],
  closeOnSelect: true
};

interface ExpenseFilterProps {
  onFilterChange: Dispatch<SetStateAction<ExpenseDashboardOverviewRequestBody | undefined>>;
}

const ExpensesFilter = React.memo(({ onFilterChange }: ExpenseFilterProps): JSX.Element => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  useEffect(() => {
    const promises = [API.GetTeacherDropdownOptions(), API.GetInstrumentDropdownOptions()];
    Promise.allSettled(promises)
      .then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeachers((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Instrument>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setInstruments((parsedResponse as ResponseMany<Instrument>).results);
          }
        } else {
          showSnackbar("Failed to fetch instruments data!", "error");
        }
      })
      .finally(() => {
        // onFilterChange(defaultFilterStateValue);
      });
  }, []);

  const defaultStartDate = useMemo(() => moment().subtract({ year: 1 }), []);
  const defaultEndDate = useMemo(() => moment(), []);

  const defaultFilterStateValue: ExpenseDashboardOverviewRequestBody = {
    teacherIds: teachers.map((teacher) => teacher.teacherId),
    instrumentIds: instruments.map((instrument) => instrument.instrumentId),
    startDate: { month: defaultStartDate.month(), year: defaultStartDate.year() },
    endDate: { month: defaultEndDate.month(), year: defaultEndDate.year() }
  };

  const getTeacherOptionLabel = useCallback((option: Teacher) => {
    return getFullNameFromTeacher(option as Teacher);
  }, []);

  const getSubjectIdFromTeacher = useCallback((subject: Teacher) => {
    return subject.teacherId.toString();
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
            ...(prev ? prev : defaultFilterStateValue),
            startDate: { month: startDate.month() + 1, year: startDate.year() },
            endDate: { month: endDate.month() + 1, year: endDate.year() }
          }));
        }}
      />
      <DashboardSubjectFilter<Teacher>
        options={teachers}
        getOptionLabel={getTeacherOptionLabel}
        gridProps={{ sm: 12, md: 4, xl: 5 }}
        subjectLabel="Teacher Filter"
        getSubjectId={getSubjectIdFromTeacher}
        onChange={(value) => {
          console.log("ONFILTERCHANGE 2");
          onFilterChange((prev) => ({
            ...(prev ? prev : defaultFilterStateValue),
            teacherIds: value.map((teacher) => teacher.teacherId)
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
          console.log("ONFILTERCHANGE 3");
          onFilterChange((prev) => ({
            ...(prev ? prev : defaultFilterStateValue),
            instrumentIds: value.map((instrument) => instrument.instrumentId)
          }));
        }}
      />
    </DashboardFilterContainer>
  );
});

export default ExpensesFilter;
