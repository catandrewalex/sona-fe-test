import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { Box } from "@mui/material";
import ExpenseFilter from "@sonamusica-fe/components/Pages/Dashboard/Expense/ExpenseFilter";
import { ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import ExpenseOverview from "@sonamusica-fe/components/Pages/Dashboard/Expense/ExpenseOverview";
import ExpenseDetail from "@sonamusica-fe/components/Pages/Dashboard/Expense/detail/ExpenseDetail";

const ExpenseDashboardPage = (): JSX.Element => {
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
    <PageContainer navTitle="Dashboard - Expense">
      <Box sx={{ position: "relative" }}>
        <ExpenseFilter onFilterChange={setFilterState} markFirstVisit={markFirstVisit} />
        {filterState && (
          <>
            <ExpenseOverview data={filterState} ready={!firstVisit} />
            <ExpenseDetail data={filterState} ready={!firstVisit} />
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default ExpenseDashboardPage;
