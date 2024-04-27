import { Attendance } from "@sonamusica-fe/types";

import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

type GetAttendanceRequestConfig = GetRequestConfig & {
  classId: number;
};

const GetAttendanceByClass = (
  { page = 1, resultsPerPage = 10000, classId }: GetAttendanceRequestConfig = { classId: 0 }
): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.get<Attendance>({
    url: `${Routes.CLASS}/${classId}/attendances`,
    config: { params: { page, resultsPerPage } }
  });
};

export default {
  GetAttendanceByClass
};
