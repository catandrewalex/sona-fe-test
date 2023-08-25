import { Course } from "@sonamusica-fe/types";
import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

const GetCourseDropdownOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Course>> => {
  return API.get<Course>({
    url: Routes.COURSE,
    config: { params: { page, resultsPerPage } }
  });
};

export default { GetCourseDropdownOptions };
