import { Class } from "@sonamusica-fe/types";
import {
  ClassInsertFormRequest,
  ClassDeleteRequest,
  ClassUpdateFormRequest
} from "@sonamusica-fe/types/form/class";
import API, { FailedResponse, GetRequestConfig, SuccessResponse } from "api";

interface GetClassConfig extends GetRequestConfig {
  includeDeactivated?: boolean;
}

const GetAllClass = ({
  page = 1,
  resultsPerPage = 10000,
  includeDeactivated = true
}: GetClassConfig = {}): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.get<Class>({
    url: `/classes?page=${page}&resultsPerPage=${resultsPerPage}&includeDeactivated=${
      includeDeactivated ? "true" : "false"
    }`
  });
};

const InsertClass = (
  data: ClassInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.post<Class>({
    url: "/classes",
    config: { data: { data } }
  });
};

const UpdateClass = (
  data: ClassUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Class>> => {
  return API.put<Class>({
    url: "/classes",
    config: { data: { data } }
  });
};

const DeleteClass = (
  data: ClassDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: "/classes",
    config: { data: { data } }
  });
};

export default { GetAllClass, InsertClass, UpdateClass, DeleteClass };
