import { User } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetUserData = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: "/user-data",
    config: { data: { id } }
  });
};

const GetAllUser = (
  page = 1,
  resultsPerPage = 10000
): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: "/get-users",
    config: { data: { page, resultsPerPage } }
  });
};

export default { GetUserData, GetAllUser };
