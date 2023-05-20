import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { ManySnackbarConfig, useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { FailedResponse, SuccessResponse } from "api";
import authModule from "./auth";
import userModule from "./user";
import teacherModule from "./teacher";
import studentModule from "./student";

export default {
  ...authModule,
  ...userModule,
  ...teacherModule,
  ...studentModule
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useApiTransformer = () => {
  const { showSnackbar, showSnackbarMany } = useSnack();
  const logout = useUser((state) => state.logout);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends any>(
    response: SuccessResponse<T> | FailedResponse,
    showSuccessMessage = true
  ) => {
    if (response instanceof FailedResponse) {
      if (response.status === 401) logout();

      const errors = Object.entries(response.messages).map((val) => val[1]);

      if (errors.length > 1) {
        showSnackbarMany(
          errors.map((err) => ({
            message: err,
            variant: "error",
            configs: {
              autoHideDuration: 10000
            }
          })) as ManySnackbarConfig[]
        );
      } else {
        showSnackbar(errors[0], "error", { autoHideDuration: 10000 });
      }
    } else {
      if (showSuccessMessage) {
        showSnackbar(response.message, "success");
      }
      return response.data;
    }
  };
};
