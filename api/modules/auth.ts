import { User } from "@sonamusica-fe/types";
import API, { BasicResponse } from "api";

const Login = (email: string, password: string): Promise<BasicResponse<User>> => {
  return API.post({
    url: "/login",
    config: {
      data: {
        email,
        password
      }
    }
  });
};

export default { Login };
