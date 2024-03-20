import { Student } from "@sonamusica-fe/types";
import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

const GetStudentDropdownOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.get<Student>({
    url: Routes.STUDENT,
    config: { params: { page, resultsPerPage } }
  });
};

export default { GetStudentDropdownOptions };
