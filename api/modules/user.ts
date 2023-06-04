import { User } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetUserData = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: "/user/" + id
  });
};

const GetAllUser = (
  page = 1,
  resultsPerPage = 10000
): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: `/users?page=${page}&resultsPerPage=${resultsPerPage}`
  });
};

const UpdateUser = (user: Partial<User>[]): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.put<User>({
    url: "/users",
    config: { data: { data: user } }
  });
};

const CreateUser = (user: Partial<User>[]): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: "/users",
    config: { data: { data: user } }
  });
};

export default { GetUserData, GetAllUser, UpdateUser, CreateUser };
