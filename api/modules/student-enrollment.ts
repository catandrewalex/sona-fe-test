import { StudentEnrollment } from "@sonamusica-fe/types";
import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

const GetStudentEnrollmentDropdownOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<StudentEnrollment>> => {
  return API.get<StudentEnrollment>({
    url: Routes.STUDENT_ENROLLMENT,
    config: { params: { page, resultsPerPage } }
  });
};

export default { GetStudentEnrollmentDropdownOptions };
