import { User } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const GetUserProfile = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.post<User>({
    url: "/user-profile",
    config: { data: { id } }
  });
};

export default { GetUserProfile };
