import { User } from "@sonamusica-fe/types";
import { UserUpdateFormRequest, UserInsertFormRequest } from "@sonamusica-fe/types/form/user";
import API, { FailedResponse, GetRequestConfig, SuccessResponse } from "api";

type UserFilter = "NOT_TEACHER" | "NOT_STUDENT";
interface GetUserConfig extends GetRequestConfig {
  filter?: UserFilter;
  includeDeactivated?: boolean;
}

const GetUserData = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: "/user/" + id
  });
};

const GetAllUser = ({
  page = 1,
  resultsPerPage = 10000,
  filter,
  includeDeactivated = true
}: GetUserConfig = {}): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: `/users?page=${page}&resultsPerPage=${resultsPerPage}${
      filter ? "&filter=" + filter : ""
    }&includeDeactivated=${includeDeactivated ? "true" : "false"}`
  });
};

const UpdateUser = (
  user: UserUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.put<User>({
    url: "/users",
    config: { data: { data: user } }
  });
};

const CreateUser = (
  user: UserInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: "/users",
    config: { data: { data: user } }
  });
};

export default { GetUserData, GetAllUser, UpdateUser, CreateUser };
