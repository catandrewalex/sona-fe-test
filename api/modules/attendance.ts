import { Attendance } from "@sonamusica-fe/types";
import {
  AddAttendanceBatchFormRequest,
  AddAttendanceFormRequest,
  AssignAttendanceTokenFormRequest,
  EditAttendanceFormRequest
} from "@sonamusica-fe/types/form/attendance";

import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

type GetAttendanceRequestConfig = GetRequestConfig & {
  classId: number;
  studentId?: number;
};

const GetAttendanceByClass = (
  { page = 1, resultsPerPage = 10000, classId, studentId }: GetAttendanceRequestConfig = {
    classId: 0
  }
): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.get<Attendance>({
    url: `${Routes.CLASS}/${classId}/attendances`,
    config: { params: { page, resultsPerPage, studentId } }
  });
};

const AddAttendance = (
  classId: number,
  data: AddAttendanceFormRequest
): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.post<Attendance>({
    url: `${Routes.CLASS}/${classId}/attendances/add`,
    config: { data }
  });
};

const AddAttendanceBatch = (
  data: AddAttendanceBatchFormRequest[]
): Promise<FailedResponse | SuccessResponse<string>> => {
  return API.post<string>({
    url: `${Routes.ATTENDANCE}/batch`,
    config: { data: { data } }
  });
};

const AssignAttendanceToken = (
  id: number,
  data: AssignAttendanceTokenFormRequest
): Promise<FailedResponse | SuccessResponse<string>> => {
  return API.post<string>({
    url: `${Routes.ATTENDANCE}/${id}/assignToken`,
    config: { data }
  });
};

const EditAttendance = (
  id: number,
  data: EditAttendanceFormRequest
): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.post<Attendance>({
    url: `${Routes.ATTENDANCE}/${id}/edit`,
    config: { data }
  });
};

const RemoveAttendance = (id: number): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.post<Attendance>({
    url: `${Routes.ATTENDANCE}/${id}/remove`
  });
};

export default {
  GetAttendanceByClass,
  AddAttendance,
  AddAttendanceBatch,
  AssignAttendanceToken,
  EditAttendance,
  RemoveAttendance
};
