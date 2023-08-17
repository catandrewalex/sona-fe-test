import { StudentEnrollment, StudentLearningToken } from "@sonamusica-fe/types";
import {
  StudentLearningTokenUpdateFormRequest,
  StudentLearningTokenInsertFormRequest,
  StudentLearningTokenDeleteRequest
} from "@sonamusica-fe/types/form/admin/student-learning-token";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllStudentLearningToken = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<StudentLearningToken>> => {
  return API.get<StudentLearningToken>({
    url: AdminRoutes.STUDENT_LEARNING_TOKEN,
    config: { params: { page, resultsPerPage } }
  });
};

const GetAllStudentEnrollment = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<StudentEnrollment>> => {
  return API.get<StudentEnrollment>({
    url: AdminRoutes.STUDENT_ENROLLMENT,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdateStudentLearningToken = (
  data: StudentLearningTokenUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<StudentLearningToken>> => {
  return API.put<StudentLearningToken>({
    url: AdminRoutes.STUDENT_LEARNING_TOKEN,
    config: { data: { data } }
  });
};

const InsertStudentLearningToken = (
  data: StudentLearningTokenInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<StudentLearningToken>> => {
  return API.post<StudentLearningToken>({
    url: AdminRoutes.STUDENT_LEARNING_TOKEN,
    config: { data: { data } }
  });
};

const DeleteStudentLearningToken = (
  data: StudentLearningTokenDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.STUDENT_LEARNING_TOKEN,
    config: { data: { data } }
  });
};

export default {
  GetAllStudentLearningToken,
  InsertStudentLearningToken,
  UpdateStudentLearningToken,
  DeleteStudentLearningToken,
  GetAllStudentEnrollment
};
