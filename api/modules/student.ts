import { Student } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetAllStudent = (
  page = 1,
  resultsPerPage = 10000
): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.post<Student>({
    url: "/get-students",
    config: { data: { page, resultsPerPage } }
  });
};

export default { GetAllStudent };
