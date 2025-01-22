import { StudentWithStudentLearningTokensDisplay } from "@sonamusica-fe/types";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

const GetStudentLearningTokenDisplayByClass = (
  classId: number
): Promise<FailedResponse | SuccessResponse<StudentWithStudentLearningTokensDisplay>> => {
  return API.get<StudentWithStudentLearningTokensDisplay>({
    // we add dummy URL query parameter "no-cache", to prevent any intermediate server from caching this request,
    // thus causing the FE unable to refresh the data, unless the cache has expired
    url: `${Routes.CLASS}/${classId}/studentLearningTokensDisplay?no-cache=true`
  });
};

export default { GetStudentLearningTokenDisplayByClass };
