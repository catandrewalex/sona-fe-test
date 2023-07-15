import { Teacher } from "@sonamusica-fe/types";
import {
  TeacherInsertFormRequest,
  TeacherInsertNewUserFormRequest,
  TeacherDeleteRequest
} from "@sonamusica-fe/types/form/teacher";
import API, { FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllTeacher = ({ page, resultsPerPage }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Teacher>
> => {
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
