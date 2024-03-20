import { Class, SearchClassConfig } from "@sonamusica-fe/types";

import API, { FailedResponse, Routes, SuccessResponse } from "api";

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
  SearchClassByTeacherStudentCourse
};
