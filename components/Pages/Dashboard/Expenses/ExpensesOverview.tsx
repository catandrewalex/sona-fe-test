import { DashboardChartBaseData, ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import LineChart from "@sonamusica-fe/components/Chart/LineChart";
import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import moment from "moment";
import { DatasetType } from "@mui/x-charts/internals";
import {
  convertNumberToCurrencyString,
  getMonthNamesFromTwoMomentInstance
} from "@sonamusica-fe/utils/StringUtil";

interface ExpensesOverviewProps {
  data: ExpenseDashboardOverviewRequestBody | undefined;
}

// TODO REMOVE AFTER API FINISH
function generateRandomData(data: ExpenseDashboardOverviewRequestBody) {
  const timeValues = getMonthNamesFromTwoMomentInstance(
    moment(`${data.startDate.year}-${data.startDate.month}`, "yyyy-MM"),
    moment(`${data.endDate.year}-${data.endDate.month}`, "yyyy-MM")
  );
  return timeValues.map((val) => ({
    name: val,
    value: Math.floor(Math.random() * (10000 - 500 + 1) + 500) * 1000
  }));
}

const ExpensesOverview = ({ data }: ExpensesOverviewProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(data === undefined);
  const [chartData, setChartData] = useState<DashboardChartBaseData[]>([]);

  useEffect(() => {
    setLoading(true);
    if (data) {
      new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          setChartData(generateRandomData(data));
          setLoading(false);
          resolve();
        }, 3000)
      );
    }
  }, [data]);

  if (data) generateRandomData(data);
  return (
    <Box>
      <Typography variant="h4" sx={{ my: 1 }}>
        Overview
      </Typography>

      <LineChart
        containerHeight={"75vh"}
        loading={loading}
        dataset={loading ? [] : (chartData as unknown as DatasetType)}
        xAxis={[
          {
            dataKey: "name",
            scaleType: "band",
            valueFormatter: (name, context) =>
              context.location === "tick" ? name.split(" ").join("\n") : name
          }
        ]}
        yAxis={
          loading
            ? []
            : [
                {
                  label: "Total (Rp)",
                  min: 500000
                }
              ]
        }
        series={[
          {
            dataKey: "value",
            valueFormatter: (value) => (value ? convertNumberToCurrencyString(value) : "-")
          }
        ]}
        grid={loading ? undefined : { horizontal: true, vertical: true }}
        margin={{ left: 100 }}
        sx={{
          [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translateX(-50px)"
          },
          border: (theme) => `2px solid ${theme.palette.divider}`
        }}
      />
      <Divider sx={{ mt: 2, borderBottomWidth: "thick" }} />
    </Box>
  );
};

export default ExpensesOverview;
