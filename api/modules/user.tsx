import { User } from "@sonamusica-fe/types";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

const GetUserProfile = (): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: `${Routes.USER_PROFILE}`
  });
};

export default { GetUserProfile };
