import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { ManySnackbarConfig, useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { BasicResponse } from "api";
import authModule from "./auth";

export default {
  ...authModule
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useApiTransformer = () => {
  const { showSnackbar, showSnackbarMany } = useSnack();
  const logout = useUser((state) => state.logout);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends any>(response: BasicResponse<T>, showSuccessMessage = true) => {
    if (response.status === 401) logout();
    else {
      if (response.error.length > 0) {
        if (response.error.length > 1) {
          showSnackbarMany(
            response.error.map((err) => ({
              message: err,
              variant: "error",
              configs: {
                autoHideDuration: 60000
              }
            })) as ManySnackbarConfig[]
          );
        } else {
          showSnackbar(response.error[0], "error", { autoHideDuration: 60000 });
        }
      } else if (showSuccessMessage) {
        showSnackbar(response.message, "success");
      }
    }
    return response.data;
  };
};
