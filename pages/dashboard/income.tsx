import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { Box } from "@mui/material";
import IncomeFilter from "@sonamusica-fe/components/Pages/Dashboard/Income/IncomeFilter";
import { IncomeDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import IncomeOverview from "@sonamusica-fe/components/Pages/Dashboard/Income/IncomeOverview";
import IncomeDetail from "@sonamusica-fe/components/Pages/Dashboard/Income/detail/IncomeDetail";

const IncomeDashboardPage = (): JSX.Element => {
  const [filterState, setFilterState] = useState<IncomeDashboardOverviewRequestBody>();
  const [firstVisit, setFirstVisit] = useState<boolean>(true);

  const finishLoading = useApp((state) => state.finishLoading);

  useEffect(() => {
    finishLoading();
  }, []);

  const markFirstVisit = useCallback(() => {
    setFirstVisit(false);
  }, []);

  return (
    <PageContainer navTitle="Dashboard - Income">
      <Box sx={{ position: "relative" }}>
        <IncomeFilter onFilterChange={setFilterState} markFirstVisit={markFirstVisit} />
        {filterState && (
          <>
            <IncomeOverview data={filterState} ready={!firstVisit} />
            <IncomeDetail data={filterState} ready={!firstVisit} />
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default IncomeDashboardPage;
