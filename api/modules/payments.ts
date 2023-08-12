import { EnrollmentPayment } from "@sonamusica-fe/types";
import {
  EnrollmentPaymentUpdateFormRequest,
  EnrollmentPaymentInsertFormRequest,
  EnrollmentPaymentDeleteRequest
} from "@sonamusica-fe/types/form/enrollment-payment";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

interface SearchPaymentConfig {
  startDateTime?: string;
  endDateTime?: string;
}
const SearchPayments = ({ startDateTime, endDateTime }: SearchPaymentConfig = {}): Promise<
  FailedResponse | SuccessResponse<EnrollmentPayment>
> => {
  return API.get<EnrollmentPayment>({
    url: Routes.PAYMENT,
    config: { params: { startDateTime, endDateTime } }
  });
};

// const UpdateEnrollmentPayment = (
//   data: EnrollmentPaymentUpdateFormRequest[]
// ): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
//   return API.put<EnrollmentPayment>({
//     url: AdminRoutes.ENROLLMENT_PAYMENT,
//     config: { data: { data } }
//   });
// };

// const InsertEnrollmentPayment = (
//   data: EnrollmentPaymentInsertFormRequest[]
// ): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
//   return API.post<EnrollmentPayment>({
//     url: AdminRoutes.ENROLLMENT_PAYMENT,
//     config: { data: { data } }
//   });
// };

// const DeleteEnrollmentPayment = (
//   data: EnrollmentPaymentDeleteRequest[]
// ): Promise<FailedResponse | SuccessResponse<undefined>> => {
//   return API.delete<undefined>({
//     url: AdminRoutes.ENROLLMENT_PAYMENT,
//     config: { data: { data } }
//   });
// };

export default {
  SearchPayments
  //   InsertEnrollmentPayment,
  //   UpdateEnrollmentPayment,
  //   DeleteEnrollmentPayment
};
