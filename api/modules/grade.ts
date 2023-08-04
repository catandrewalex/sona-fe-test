import { Grade } from "@sonamusica-fe/types";
import {
  GradeUpdateFormRequest,
  GradeInsertFormRequest,
  GradeDeleteRequest
} from "@sonamusica-fe/types/form/grade";
import API, { FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllGrade = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Grade>
> => {
  return API.get<Grade>({
    url: `/grades?page=${page}&resultsPerPage=${resultsPerPage}`
  });
};

const UpdateGrade = (
  data: GradeUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Grade>> => {
  return API.put<Grade>({
    url: "/grades",
    config: { data: { data } }
  });
};

const InsertGrade = (
  data: GradeInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Grade>> => {
  return API.post<Grade>({
    url: "/grades",
    config: { data: { data } }
  });
};

const DeleteGrade = (
  data: GradeDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: "/grades",
    config: { data: { data } }
  });
};

export default { GetAllGrade, InsertGrade, UpdateGrade, DeleteGrade };
