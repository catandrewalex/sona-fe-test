import {
  Class,
  EditClassConfigRequest,
  EditClassCourseRequest,
  SearchClassConfig
} from "@sonamusica-fe/types";

import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

interface GetClassConfig extends GetRequestConfig {
  includeDeactivated?: boolean;
}

const GetAllClass = ({
  page = 1,
  resultsPerPage = 10000,
  includeDeactivated = true
}: GetClassConfig = {}): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: `${Routes.CLASS}`,
    config: { params: { page, resultsPerPage, includeDeactivated } }
  });
};

const GetClassById = (id: number): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: `${Routes.CLASS}/${id}`
  });
};

const EditClassesConfigs = (
  data: EditClassConfigRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.post<Class>({
    url: `${Routes.CLASS}/edit/config`,
    config: { data: { data } }
  });
};

const EditClassesCourses = (
  data: EditClassCourseRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.post<Class>({
    url: `${Routes.CLASS}/edit/course`,
    config: { data: { data } }
  });
};

const SearchClassByTeacherStudentCourse = ({
  studentId,
  teacherId,
  courseId
}: SearchClassConfig = {}): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: `${Routes.CLASS}/search`,
    config: { params: { studentId, teacherId, courseId } }
  });
};

export default {
  GetAllClass,
  GetClassById,
  EditClassesConfigs,
  EditClassesCourses,
  SearchClassByTeacherStudentCourse
};
