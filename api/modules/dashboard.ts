import API, { FailedResponse, Routes, SuccessResponse } from "../index";
import { DashboardChartBaseData, ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";

const GetExpenseOverviewData = (
  data: ExpenseDashboardOverviewRequestBody
): Promise<FailedResponse | SuccessResponse<DashboardChartBaseData[]>> => {
  return API.post<DashboardChartBaseData[]>({
    url: `${Routes.DASHBOARD}/expense/overview`,
    config: { data }
  });
};

export default {
  GetExpenseOverviewData
};
