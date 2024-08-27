import Grid2 from "@mui/material/Unstable_Grid2";
import { Box, Divider } from "@mui/material";

interface DashboardFilterContainerProps {
  children: JSX.Element | JSX.Element[];
}

const DashboardFilterContainer = ({ children }: DashboardFilterContainerProps): JSX.Element => {
  return (
    <Box>
      <Grid2 container spacing={2}>
        {children}
      </Grid2>
      <Divider sx={{ mt: 2, borderBottomWidth: "thick" }} />
    </Box>
  );
};

export default DashboardFilterContainer;
