import { TeacherSpecialFee } from "@sonamusica-fe/types";
import {
  TeacherSpecialFeeUpdateFormRequest,
  TeacherSpecialFeeInsertFormRequest,
  TeacherSpecialFeeDeleteRequest
} from "@sonamusica-fe/types/form/teacher-special-fee";
import API, { FailedResponse, GetRequestConfig, AdminRoutes, SuccessResponse } from "api";

const GetAllTeacherSpecialFee = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<TeacherSpecialFee>> => {
  return API.get<TeacherSpecialFee>({
    url: AdminRoutes.TEACHER_SPECIAL_FEE,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdateTeacherSpecialFee = (
  data: TeacherSpecialFeeUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<TeacherSpecialFee>> => {
  return API.put<TeacherSpecialFee>({
    url: AdminRoutes.TEACHER_SPECIAL_FEE,
    config: { data: { data } }
  });
};

const InsertTeacherSpecialFee = (
  data: TeacherSpecialFeeInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<TeacherSpecialFee>> => {
  return API.post<TeacherSpecialFee>({
    url: AdminRoutes.TEACHER_SPECIAL_FEE,
    config: { data: { data } }
  });
};

const DeleteTeacherSpecialFee = (
  data: TeacherSpecialFeeDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.TEACHER_SPECIAL_FEE,
    config: { data: { data } }
  });
};

export default {
  GetAllTeacherSpecialFee,
  InsertTeacherSpecialFee,
  UpdateTeacherSpecialFee,
  DeleteTeacherSpecialFee
};
