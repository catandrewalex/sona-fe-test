import { LineChartProps as MuiLineChartProps } from "@mui/x-charts";
import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

const MuiLineChart = lazy(() => import("@mui/x-charts").then((x) => ({ default: x.LineChart })));

interface LineChartProps {
  containerHeight?: string;
}

const LineChart = ({
  containerHeight,
  ...props
}: LineChartProps & MuiLineChartProps): JSX.Element => {
  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto", height: containerHeight ?? "50vh" }}>
      <Suspense
        fallback={
          <Box
            height={"100%"}
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CircularProgress size={50} />
          </Box>
        }
      >
        <MuiLineChart {...props} />
      </Suspense>
    </Box>
  );
};

export default LineChart;
