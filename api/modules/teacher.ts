import { Teacher } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetAllTeacher = (
  page = 1,
  resultsPerPage = 10000
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: "/get-teachers",
    config: { data: { page, resultsPerPage } }
  });
};

export default { GetAllTeacher };
