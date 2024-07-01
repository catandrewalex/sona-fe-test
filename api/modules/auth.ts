import { LoginResponse } from "@sonamusica-fe/types";
import API, { FailedResponse, SuccessResponse } from "api";

const Login = (
  usernameOrEmail: string,
  password: string
): Promise<FailedResponse | SuccessResponse<LoginResponse>> => {
  return API.post<LoginResponse>({
    url: "/login",
    config: {
      data: {
        usernameOrEmail,
        password
      }
    }
  });
};

const ForgotPassword = (email: string): Promise<FailedResponse | SuccessResponse<string>> => {
  return API.post<string>({
    url: "/forgot-password",
    config: { data: { email } }
  });
};

const ResetPassword = (
  resetToken: string,
  newPassword: string
): Promise<FailedResponse | SuccessResponse<string>> => {
  return API.post<string>({
    url: "/reset-password",
    config: { data: { resetToken, newPassword } }
  });
};

const ChangePassword = (
  userId: number,
  newPassword: string
): Promise<FailedResponse | SuccessResponse<string>> => {
  return API.put<string>({
    url: `/users/${userId}/password`,
    config: { data: { newPassword } }
  });
};

export default { Login, ForgotPassword, ResetPassword, ChangePassword };
