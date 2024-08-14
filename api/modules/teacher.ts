import { Teacher } from "@sonamusica-fe/types";
import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

const GetTeacherDropdownOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.get<Teacher>({
    url: Routes.TEACHER,
    config: { params: { page, resultsPerPage } }
  });
};

const GetTeacherForAttendanceDropdownOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.get<Teacher>({
    url: Routes.TEACHER_FOR_ATTENDANCE,
    config: { params: { page, resultsPerPage } }
  });
};

const GetTeacherForDashboardOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.get<Teacher>({
    url: Routes.TEACHER_FOR_DASHBOARD,
    config: { params: { page, resultsPerPage } }
  });
};

export default {
  GetTeacherDropdownOptions,
  GetTeacherForAttendanceDropdownOptions,
  GetTeacherForDashboardOptions
};
