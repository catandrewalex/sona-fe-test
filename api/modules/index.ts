import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { FailedResponse, SuccessResponse } from "api";
import authModule from "./auth";
import userModule from "./user";
import teacherModule from "./teacher";
import studentModule from "./student";
import gradeModule from "./grade";
import courseModule from "./course";
import instrumentModule from "./instrument";
import classModule from "./class";
import teacherSpecialFeeModule from "./teacher-special-fee";
import studentLearningTokenModule from "./student-learning-token";

export default {
  ...authModule,
  ...userModule,
  ...teacherModule,
  ...studentModule,
  ...gradeModule,
  ...courseModule,
  ...instrumentModule,
  ...classModule,
  ...teacherSpecialFeeModule,
  ...studentLearningTokenModule
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useApiTransformer = () => {
  const { showSnackbar } = useSnack();
  const logout = useUser((state) => state.logout);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends any>(
    response: SuccessResponse<T> | FailedResponse,
    showSuccessMessage = true
  ) => {
    if (response instanceof FailedResponse) {
      if (response.status === 401) logout();

      if (response.message) showSnackbar(response.message, "error", { autoHideDuration: 10000 });
      return response;
    } else {
      if (showSuccessMessage) {
        showSnackbar(response.message, "success");
      }
      return response.data;
    }
  };
};
