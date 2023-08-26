import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { FailedResponse, SuccessResponse } from "api";
import authModule from "./auth";
import userAdminModule from "./admin/user";
import teacherAdminModule from "./admin/teacher";
import studentAdminModule from "./admin/student";
import gradeAdminModule from "./admin/grade";
import courseAdminModule from "./admin/course";
import instrumentAdminModule from "./admin/instrument";
import classAdminModule from "./admin/class";
import teacherSpecialFeeAdminModule from "./admin/teacher-special-fee";
import studentLearningTokenAdminModule from "./admin/student-learning-token";
import enrollmentPaymentAdminModule from "./admin/enrollment-payment";
import presenceAdminModule from "./admin/presence";
import paymentsModule from "./payments";
import teacherModule from "./teacher";
import studentModule from "./student";
import courseModule from "./course";
import classModule from "./class";

export default {
  ...authModule,
  ...userAdminModule,
  ...teacherAdminModule,
  ...studentAdminModule,
  ...gradeAdminModule,
  ...courseAdminModule,
  ...instrumentAdminModule,
  ...classAdminModule,
  ...teacherSpecialFeeAdminModule,
  ...studentLearningTokenAdminModule,
  ...enrollmentPaymentAdminModule,
  ...presenceAdminModule,
  ...paymentsModule,
  ...teacherModule,
  ...studentModule,
  ...courseModule,
  ...classModule
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
