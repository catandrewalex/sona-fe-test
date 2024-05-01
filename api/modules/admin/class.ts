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

const AdminGetAllClass = ({
  page = 1,
  resultsPerPage = 10000,
  includeDeactivated = true
}: GetClassConfig = {}): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: AdminRoutes.CLASS,
    config: { params: { page, resultsPerPage, includeDeactivated } }
  });
};

const AdminGetClassById = (id: number): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: `${AdminRoutes.CLASS}/${id}`
  });
};

const AdminInsertClass = (
  data: ClassInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.post<Class>({
    url: AdminRoutes.CLASS,
    config: { data: { data } }
  });
};

const AdminUpdateClass = (
  data: ClassUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.put<Class>({
    url: AdminRoutes.CLASS,
    config: { data: { data } }
  });
};

const AdminDeleteClass = (
  data: ClassDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.CLASS,
    config: { data: { data } }
  });
};

export default {
  AdminGetAllClass,
  AdminGetClassById,
  AdminInsertClass,
  AdminUpdateClass,
  AdminDeleteClass
};
