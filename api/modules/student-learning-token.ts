import { StudentWithStudentLearningTokensDisplay } from "@sonamusica-fe/types";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

const GetStudentLearningTokenDisplayByClass = (
  classId: number
): Promise<FailedResponse | SuccessResponse<StudentWithStudentLearningTokensDisplay>> => {
  return API.get<StudentWithStudentLearningTokensDisplay>({
    url: `${Routes.CLASS}/${classId}/studentLearningTokensDisplay`
  });
};

export default { GetStudentLearningTokenDisplayByClass };
