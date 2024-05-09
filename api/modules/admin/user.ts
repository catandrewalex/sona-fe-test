import { User } from "@sonamusica-fe/types";
import { UserUpdateFormRequest, UserInsertFormRequest } from "@sonamusica-fe/types/form/admin/user";
import API, { FailedResponse, GetRequestConfig, AdminRoutes, SuccessResponse } from "api";

type UserFilter = "NOT_TEACHER" | "NOT_STUDENT";
interface GetUserConfig extends GetRequestConfig {
  filter?: UserFilter;
  includeDeactivated?: boolean;
}

const GetUserData = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: `${AdminRoutes.USER}/${id}`
  });
};

const GetAllUser = ({
  page = 1,
  resultsPerPage = 10000,
  filter,
  includeDeactivated = true
}: GetUserConfig = {}): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: AdminRoutes.USER,
    config: {
      params: { page, resultsPerPage, filter, includeDeactivated }
    }
  });
};

const UpdateUser = (
  user: UserUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.put<User>({
    url: AdminRoutes.USER,
    config: { data: { data: user } }
  });
};

const CreateUser = (
  user: UserInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: AdminRoutes.USER,
    config: { data: { data: user } }
  });
};

export default { GetUserData, GetAllUser, UpdateUser, CreateUser };
