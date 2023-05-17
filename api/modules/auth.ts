import { LoginResponse } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const Login = (
  email: string,
  password: string
): Promise<FailedResponse | SuccessResponse<LoginResponse>> => {
  return API.post<LoginResponse>({
    url: "/login",
    config: {
      data: {
        email,
        password
      }
    }
  });
};

const ForgotPassword = (email: string): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.post<undefined>({
    url: "/forgot-password",
    config: { data: { email } }
  });
};

const ResetPassword = (
  resetToken: string,
  newPassword: string
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.post<undefined>({
    url: "/reset-password",
    config: { data: { resetToken, newPassword } }
  });
};

export default { Login, ForgotPassword, ResetPassword };
