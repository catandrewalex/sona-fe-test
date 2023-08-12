import { Student } from "@sonamusica-fe/types";
import {
  StudentInsertFormRequest,
  StudentInsertNewUserFormRequest,
  StudentDeleteRequest
} from "@sonamusica-fe/types/form/student";
import API, { FailedResponse, GetRequestConfig, AdminRoutes, SuccessResponse } from "api";

const GetAllStudent = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Student>
> => {
  return API.get<Student>({
    url: AdminRoutes.STUDENT,
    config: { params: { page, resultsPerPage } }
  });
};

const InsertStudent = (
  data: StudentInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.post<Student>({
    url: AdminRoutes.STUDENT,
    config: { data: { data } }
  });
};

const InsertStudentNewUser = (
  data: StudentInsertNewUserFormRequest[]
): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.post<Student>({
    url: AdminRoutes.STUDENT + "/new-users",
    config: { data: { data } }
  });
};

const DeleteStudent = (
  data: StudentDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.STUDENT,
    config: { data: { data } }
  });
};

export default { GetAllStudent, InsertStudent, InsertStudentNewUser, DeleteStudent };
