import API, { FailedResponse, Routes, SuccessResponse } from "../index";
import {
  DashboardChartBaseData,
  ExpenseDashboardDetailRequestBody,
  ExpenseDashboardOverviewRequestBody,
  IncomeDashboardDetailRequestBody,
  IncomeDashboardOverviewRequestBody
} from "@sonamusica-fe/types";

const GetExpenseOverviewData = (
  data: ExpenseDashboardOverviewRequestBody
): Promise<FailedResponse | SuccessResponse<DashboardChartBaseData>> => {
  return API.post<DashboardChartBaseData>({
    url: `${Routes.DASHBOARD}/expense/overview`,
    config: { data }
  });
};

const GetIncomeOverviewData = (
  data: IncomeDashboardOverviewRequestBody
): Promise<FailedResponse | SuccessResponse<DashboardChartBaseData>> => {
  return API.post<DashboardChartBaseData>({
    url: `${Routes.DASHBOARD}/income/overview`,
    config: { data: { ...data, studentIds: [] } }
  });
};

const GetExpenseDetailData = (
  data: ExpenseDashboardDetailRequestBody
): Promise<FailedResponse | SuccessResponse<DashboardChartBaseData>> => {
  return API.post<DashboardChartBaseData>({
    url: `${Routes.DASHBOARD}/expense/monthlySummary`,
    config: { data }
  });
};

const GetIncomeDetailData = (
  data: IncomeDashboardDetailRequestBody
): Promise<FailedResponse | SuccessResponse<DashboardChartBaseData>> => {
  return API.post<DashboardChartBaseData>({
    url: `${Routes.DASHBOARD}/income/monthlySummary`,
    config: { data: { ...data, studentIds: [] } }
  });
};

export default {
  GetExpenseOverviewData,
  GetIncomeOverviewData,
  GetExpenseDetailData,
  GetIncomeDetailData
};
