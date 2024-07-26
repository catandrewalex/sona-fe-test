import Grid2 from "@mui/material/Unstable_Grid2";
import PieChart from "@sonamusica-fe/components/Chart/PieChart";
import { useCallback, useEffect, useState } from "react";
import {
  DashboardPieChartData,
  ExpenseDashboardOverviewRequestBody,
  Instrument,
  Teacher
} from "@sonamusica-fe/types";
import { FormattedMonthName, getFullNameFromTeacher } from "@sonamusica-fe/utils/StringUtil";
import { pieArcLabelClasses } from "@mui/x-charts";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse, ResponseMany } from "../../../../../api";
import { Typography } from "@mui/material";

interface ExpenseDetailPieChartProps {
  selected?: FormattedMonthName;
  data: ExpenseDashboardOverviewRequestBody | undefined;
}

// TODO REMOVE AFTER API FINISH
function generateRandomData(label: string[]) {
  const temp = label.map((val) => ({
    label: val,
    value: Math.floor(Math.random() * (10000 - 500 + 1) + 500) * 1000
  }));

  const total = temp.reduce((prev, curr) => prev + curr.value, 0);

  return temp.map((val) => ({
    ...val,
    percentage: (val.value / total) * 100.0
  }));
}

const ExpensesDetailPieChart = ({ data, selected }: ExpenseDetailPieChartProps): JSX.Element => {
  const [teacherChartData, setTeacherChartData] = useState<DashboardPieChartData[]>([]);
  const [instrumentChartData, setInstrumentChartData] = useState<DashboardPieChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(data === undefined);

  const apiTransformer = useApiTransformer();

  const fetchTeacherChart = useCallback((data, selected) => {
    return API.GetTeacherDropdownOptions().then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        return generateRandomData(
          (parsedResponse as ResponseMany<Teacher>).results.map((val) =>
            getFullNameFromTeacher(val)
          )
        );
      }
      return [];
    });
  }, []);

  const fetchInstrumentChart = useCallback((data, selected) => {
    return API.GetInstrumentDropdownOptions().then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        return generateRandomData(
          (parsedResponse as ResponseMany<Instrument>).results.map((val) => val.name)
        );
      }
      return [];
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (data) {
      Promise.allSettled([fetchTeacherChart(data, selected), fetchInstrumentChart(data, selected)])
        .then((result) => {
          if (result[0].status === "fulfilled") {
            setTeacherChartData(result[0].value);
          }
          if (result[1].status === "fulfilled") {
            setInstrumentChartData(result[1].value);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [data, selected]);

  console.log(teacherChartData);
  return (
    <Grid2 container spacing={3} sx={{ mt: 2 }}>
      <Grid2 sm={12} xl={6}>
        <Typography variant={"h5"}>Teacher Detail</Typography>
        <PieChart
          // slotProps={{ legend: { position: { vertical: "bottom", horizontal: "right" } } }}
          loading={loading}
          containerHeight={"50vh"}
          series={[
            {
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              data: loading ? [] : teacherChartData,
              arcLabel: (item) => `${item.percentage.toFixed(2)}%`
            }
          ]}
          margin={{ right: loading ? 0 : 400 }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontWeight: "bold"
            },
            border: (theme) => `2px solid ${theme.palette.divider}`
          }}
        />
      </Grid2>
      <Grid2 sm={12} xl={6}>
        <Typography variant={"h5"}>Instrument Detail</Typography>
        <PieChart
          loading={loading}
          containerHeight={"50vh"}
          series={[
            {
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              data: loading ? [] : instrumentChartData,
              arcLabel: (item) => `${item.percentage.toFixed(2)}%`
            }
          ]}
          margin={{ right: loading ? 0 : 250 }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontWeight: "bold"
            },
            border: (theme) => `2px solid ${theme.palette.divider}`
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default ExpensesDetailPieChart;
