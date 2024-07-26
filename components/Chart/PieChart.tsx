import { PieChartProps as MuiPieChartProps } from "@mui/x-charts";
import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

const MuiPieChart = lazy(() => import("@mui/x-charts").then((x) => ({ default: x.PieChart })));

interface PieChartProps {
  containerHeight?: string;
}

const PieChart = ({ containerHeight, ...props }: PieChartProps & MuiPieChartProps): JSX.Element => {
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
        <MuiPieChart {...props} />
      </Suspense>
    </Box>
  );
};

export default PieChart;
