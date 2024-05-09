import { Attendance } from "@sonamusica-fe/types";
import {
  AttendanceUpdateFormRequest,
  AttendanceInsertFormRequest,
  AttendanceDeleteRequest
} from "@sonamusica-fe/types/form/admin/attendance";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllAttendance = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Attendance>
> => {
  return API.get<Attendance>({
    url: AdminRoutes.ATTENDANCE,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdateAttendance = (
  data: AttendanceUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.put<Attendance>({
    url: AdminRoutes.ATTENDANCE,
    config: { data: { data } }
  });
};

const InsertAttendance = (
  data: AttendanceInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Attendance>> => {
  return API.post<Attendance>({
    url: AdminRoutes.ATTENDANCE,
    config: { data: { data } }
  });
};

const DeleteAttendance = (
  data: AttendanceDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.ATTENDANCE,
    config: { data: { data } }
  });
};

export default {
  GetAllAttendance,
  InsertAttendance,
  UpdateAttendance,
  DeleteAttendance
};
