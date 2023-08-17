import { Course } from "@sonamusica-fe/types";
import {
  CourseUpdateFormRequest,
  CourseInsertFormRequest,
  CourseDeleteRequest
} from "@sonamusica-fe/types/form/admin/course";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllCourse = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Course>
> => {
  return API.get<Course>({
    url: AdminRoutes.COURSE,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdateCourse = (
  data: CourseUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Course>> => {
  return API.put<Course>({
    url: AdminRoutes.COURSE,
    config: { data: { data } }
  });
};

const InsertCourse = (
  data: CourseInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Course>> => {
  return API.post<Course>({
    url: AdminRoutes.COURSE,
    config: { data: { data } }
  });
};

const DeleteCourse = (
  data: CourseDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.COURSE,
    config: { data: { data } }
  });
};

export default { GetAllCourse, InsertCourse, UpdateCourse, DeleteCourse };
