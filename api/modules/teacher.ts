import { Teacher, User } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetAllTeacher = (
  page = 1,
  resultsPerPage = 10000
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.get<Teacher>({
    url: `/teachers?page=${page}&resultsPerPage=${resultsPerPage}`
  });
};

const InsertTeacher = (
  data: Array<{ userId: number }>
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: "/teachers",
    config: { data: { data } }
  });
};

const InsertTeacherNewUser = (
  data: Array<Partial<User> & { password?: string }>
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: "/teachers/new-users",
    config: { data: { data } }
  });
};

export default { GetAllTeacher, InsertTeacher, InsertTeacherNewUser };
