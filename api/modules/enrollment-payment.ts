import { EnrollmentPayment } from "@sonamusica-fe/types";
import {
  EnrollmentPaymentUpdateFormRequest,
  EnrollmentPaymentInsertFormRequest,
  EnrollmentPaymentDeleteRequest
} from "@sonamusica-fe/types/form/enrollment-payment";
import API, { FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllEnrollmentPayment = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.get<EnrollmentPayment>({
    url: `/enrollmentPayments?page=${page}&resultsPerPage=${resultsPerPage}`
  });
};

const UpdateEnrollmentPayment = (
  data: EnrollmentPaymentUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.put<EnrollmentPayment>({
    url: "/enrollmentPayments",
    config: { data: { data } }
  });
};

const InsertEnrollmentPayment = (
  data: EnrollmentPaymentInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.post<EnrollmentPayment>({
    url: "/enrollmentPayments",
    config: { data: { data } }
  });
};

const DeleteEnrollmentPayment = (
  data: EnrollmentPaymentDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: "/enrollmentPayments",
    config: { data: { data } }
  });
};

export default {
  GetAllEnrollmentPayment,
  InsertEnrollmentPayment,
  UpdateEnrollmentPayment,
  DeleteEnrollmentPayment
};
