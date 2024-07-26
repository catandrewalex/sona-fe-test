import { User, UserTeachingInfo } from "@sonamusica-fe/types";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

const GetUserProfile = (): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: `${Routes.USER_PROFILE}`
  });
};

const GetUserTeachingInfo = (): Promise<FailedResponse | SuccessResponse<UserTeachingInfo>> => {
  return API.get<UserTeachingInfo>({
    url: `${Routes.USER_TEACHING_INFO}`
  });
};

export default { GetUserProfile, GetUserTeachingInfo };
