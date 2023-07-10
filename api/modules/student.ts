import {
  Student,
  StudentDeleteRequest,
  StudentInsertFormRequest,
  StudentInsertNewUserFormRequest
} from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetAllStudent = (
  page = 1,
  resultsPerPage = 10000
): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.get<Student>({
    url: `/students?page=${page}&resultsPerPage=${resultsPerPage}`
  });
};

const InsertStudent = (
  data: StudentInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.post<Student>({
    url: "/students",
    config: { data: { data } }
  });
};

const InsertStudentNewUser = (
  data: StudentInsertNewUserFormRequest[]
): Promise<FailedResponse | SuccessResponse<Student>> => {
  return API.post<Student>({
    url: "/students/new-users",
    config: { data: { data } }
  });
};

const DeleteStudent = (
  data: StudentDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: "/students",
    config: { data: { data: { data } } }
  });
};

export default { GetAllStudent, InsertStudent, InsertStudentNewUser, DeleteStudent };
