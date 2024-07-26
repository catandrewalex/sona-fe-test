import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useEffect, useState } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { Box } from "@mui/material";
import ExpensesFilter from "@sonamusica-fe/components/Pages/Dashboard/Expenses/ExpensesFilter";
import { ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import ExpensesOverview from "@sonamusica-fe/components/Pages/Dashboard/Expenses/ExpensesOverview";
import ExpensesDetail from "@sonamusica-fe/components/Pages/Dashboard/Expenses/detail/ExpensesDetail";

const ExpensesDashboardPage = (): JSX.Element => {
  const [filterState, setFilterState] = useState<ExpenseDashboardOverviewRequestBody>();

  const { finishLoading, startLoading } = useApp((state) => ({
    finishLoading: state.finishLoading,
    startLoading: state.startLoading
  }));

  useEffect(() => {
    finishLoading();
  }, []);

  console.log(filterState);

  return (
    <PageContainer navTitle="Dashboard - Expenses">
      <Box sx={{ position: "relative" }}>
        <ExpensesFilter onFilterChange={setFilterState} />
        <ExpensesOverview data={filterState} />
        <ExpensesDetail data={filterState} />
      </Box>
    </PageContainer>
  );
};

export default ExpensesDashboardPage;
