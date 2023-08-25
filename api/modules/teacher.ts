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

export default { GetTeacherDropdownOptions };
