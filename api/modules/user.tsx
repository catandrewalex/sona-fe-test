import { User } from "@sonamusica-fe/types";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

const GetUserData = (id: number): Promise<FailedResponse | SuccessResponse<User>> => {
  return API.get<User>({
    url: `${Routes.USER}/${id}`
  });
};

export default { GetUserData };
