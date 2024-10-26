import Grid2 from "@mui/material/Unstable_Grid2";
import PieChart from "@sonamusica-fe/components/Chart/PieChart";
import { useEffect, useState } from "react";
import { DashboardPieChartData, IncomeDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import { FormattedMonthName } from "@sonamusica-fe/utils/StringUtil";
import { DefaultizedPieValueType, pieArcLabelClasses } from "@mui/x-charts";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse, ResponseMany } from "../../../../../api";
import { Typography } from "@mui/material";

interface IncomeDetailPieChartProps {
  selected?: FormattedMonthName;
  data: IncomeDashboardOverviewRequestBody | undefined;
  ready: boolean;
}

const IncomeDetailPieChart = ({
  data,
  selected,
  ready
}: IncomeDetailPieChartProps): JSX.Element => {
  const [instrumentChartData, setInstrumentChartData] = useState<DashboardPieChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(data === undefined);

  const apiTransformer = useApiTransformer();

  useEffect(() => {
    setLoading(true);
    if (data && selected && ready) {
      Promise.allSettled([
        API.GetIncomeDetailData({
          groupBy: "INSTRUMENT",
          selectedDate: {
            month: selected.month,
            year: selected.year
          },
          instrumentIds: data.instrumentIds
        })
      ])
        .then((result) => {
          if (result[0].status === "fulfilled") {
            const parsedResponse = apiTransformer(result[0].value, false);
            if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
              setInstrumentChartData(
                (parsedResponse as ResponseMany<DashboardPieChartData>).results
              );
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [data, selected, ready]);

  return (
    <Grid2 container spacing={3} sx={{ mt: 2 }}>
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
              arcLabel: (
                item: Omit<DefaultizedPieValueType, "label"> &
                  Omit<DashboardPieChartData, "label"> & {
                    label?: string | undefined;
                  }
              ) => `${((item.percentage || 0) * 100).toFixed(2)}%`
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

export default IncomeDetailPieChart;
