import { Class } from "@sonamusica-fe/types";
import {
  ClassInsertFormRequest,
  ClassDeleteRequest,
  ClassUpdateFormRequest
} from "@sonamusica-fe/types/form/admin/class";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

interface GetClassConfig extends GetRequestConfig {
  includeDeactivated?: boolean;
}

const GetAllClass = ({
  page = 1,
  resultsPerPage = 10000,
  includeDeactivated = true
}: GetClassConfig = {}): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: AdminRoutes.CLASS,
    config: { params: { page, resultsPerPage, includeDeactivated } }
  });
};

const GetClassById = (id: number): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: `/admin/class/${id}`
  });
};

const InsertClass = (
  data: ClassInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.post<Class>({
    url: AdminRoutes.CLASS,
    config: { data: { data } }
  });
};

const UpdateClass = (
  data: ClassUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.put<Class>({
    url: AdminRoutes.CLASS,
    config: { data: { data } }
  });
};

const DeleteClass = (
  data: ClassDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.CLASS,
    config: { data: { data } }
  });
};

export default { GetAllClass, GetClassById, InsertClass, UpdateClass, DeleteClass };
