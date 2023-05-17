import { User } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetUserData = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: "/user-data",
    config: { data: { id } }
  });
};

export default { GetUserData };
