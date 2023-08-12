import { Teacher } from "@sonamusica-fe/types";
import {
  TeacherInsertFormRequest,
  TeacherInsertNewUserFormRequest,
  TeacherDeleteRequest
} from "@sonamusica-fe/types/form/teacher";
import API, { FailedResponse, GetRequestConfig, AdminRoutes, SuccessResponse } from "api";

const GetAllTeacher = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Teacher>
> => {
  return API.get<Teacher>({
    url: AdminRoutes.TEACHER,
    config: { params: { page, resultsPerPage } }
  });
};

const InsertTeacher = (
  data: TeacherInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: AdminRoutes.TEACHER,
    config: { data: { data } }
  });
};

const InsertTeacherNewUser = (
  data: TeacherInsertNewUserFormRequest[]
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: AdminRoutes.TEACHER + "/new-users",
    config: { data: { data } }
  });
};

const DeleteTeacher = (
  data: TeacherDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.TEACHER,
    config: { data: { data } }
  });
};

export default { GetAllTeacher, InsertTeacher, InsertTeacherNewUser, DeleteTeacher };
