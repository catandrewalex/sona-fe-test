import { EnrollmentPayment } from "@sonamusica-fe/types";
import {
  EnrollmentPaymentUpdateFormRequest,
  EnrollmentPaymentInsertFormRequest,
  EnrollmentPaymentDeleteRequest
} from "@sonamusica-fe/types/form/admin/enrollment-payment";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllEnrollmentPayment = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.get<EnrollmentPayment>({
    url: AdminRoutes.ENROLLMENT_PAYMENT,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdateEnrollmentPayment = (
  data: EnrollmentPaymentUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.put<EnrollmentPayment>({
    url: AdminRoutes.ENROLLMENT_PAYMENT,
    config: { data: { data } }
  });
};

const InsertEnrollmentPayment = (
  data: EnrollmentPaymentInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.post<EnrollmentPayment>({
    url: AdminRoutes.ENROLLMENT_PAYMENT,
    config: { data: { data } }
  });
};

const DeleteEnrollmentPayment = (
  data: EnrollmentPaymentDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.ENROLLMENT_PAYMENT,
    config: { data: { data } }
  });
};

export default {
  GetAllEnrollmentPayment,
  InsertEnrollmentPayment,
  UpdateEnrollmentPayment,
  DeleteEnrollmentPayment
};
