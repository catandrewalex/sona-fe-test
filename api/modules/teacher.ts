import {
  Teacher,
  TeacherDeleteRequest,
  TeacherInsertFormRequest,
  TeacherInsertNewUserFormRequest
} from "@sonamusica-fe/types";
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
  data: TeacherInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: "/teachers",
    config: { data: { data } }
  });
};

const InsertTeacherNewUser = (
  data: TeacherInsertNewUserFormRequest[]
): Promise<FailedResponse | SuccessResponse<Teacher>> => {
  return API.post<Teacher>({
    url: "/teachers/new-users",
    config: { data: { data } }
  });
};

const DeleteTeacher = (
  data: TeacherDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: "/teachers",
    config: { data: { data: { data } } }
  });
};

export default { GetAllTeacher, InsertTeacher, InsertTeacherNewUser, DeleteTeacher };
