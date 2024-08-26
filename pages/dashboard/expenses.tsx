import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { Box } from "@mui/material";
import ExpensesFilter from "@sonamusica-fe/components/Pages/Dashboard/Expenses/ExpensesFilter";
import { ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import ExpensesOverview from "@sonamusica-fe/components/Pages/Dashboard/Expenses/ExpensesOverview";
import ExpensesDetail from "@sonamusica-fe/components/Pages/Dashboard/Expenses/detail/ExpensesDetail";

const ExpensesDashboardPage = (): JSX.Element => {
  const [filterState, setFilterState] = useState<ExpenseDashboardOverviewRequestBody>();
  const [firstVisit, setFirstVisit] = useState<boolean>(true);

  const finishLoading = useApp((state) => state.finishLoading);

  useEffect(() => {
    finishLoading();
  }, []);

  const markFirstVisit = useCallback(() => {
    setFirstVisit(false);
  }, []);

  return (
    <PageContainer navTitle="Dashboard - Expenses">
      <Box sx={{ position: "relative" }}>
        <ExpensesFilter onFilterChange={setFilterState} markFirstVisit={markFirstVisit} />
        {filterState && (
          <>
            <ExpensesOverview data={filterState} ready={!firstVisit} />
            <ExpensesDetail data={filterState} ready={!firstVisit} />
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default ExpensesDashboardPage;
