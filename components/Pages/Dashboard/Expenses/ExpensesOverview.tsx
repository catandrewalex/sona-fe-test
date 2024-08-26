import { DashboardChartBaseData, ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import LineChart from "@sonamusica-fe/components/Chart/LineChart";
import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { DatasetType } from "@mui/x-charts/internals";
import { convertNumberToCurrencyString } from "@sonamusica-fe/utils/StringUtil";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse, ResponseMany } from "../../../../api";

interface ExpensesOverviewProps {
  data: ExpenseDashboardOverviewRequestBody | undefined;
  ready: boolean;
}

const ExpensesOverview = ({ data, ready }: ExpensesOverviewProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(data === undefined);
  const [chartData, setChartData] = useState<DashboardChartBaseData[]>([]);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    setLoading(true);
    if (data && ready) {
      API.GetExpenseOverviewData(data)
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setChartData((parsedResponse as ResponseMany<DashboardChartBaseData>).results);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [data, ready]);

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
            dataKey: "label",
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
