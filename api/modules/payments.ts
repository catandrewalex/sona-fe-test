import { EnrollmentPayment, EnrollmentPaymentInvoice } from "@sonamusica-fe/types";
import {
  EnrollmentPaymentUpdateFormRequest,
  EnrollmentPaymentInsertFormRequest,
  EnrollmentPaymentDeleteRequest
} from "@sonamusica-fe/types/form/admin/enrollment-payment";
import {
  EditPaymentBalanceFormRequest,
  RemovePaymentFormRequest
} from "@sonamusica-fe/types/form/payment";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

interface SearchPaymentConfig {
  startDateTime?: string;
  endDateTime?: string;
}
const SearchPayments = ({ startDateTime, endDateTime }: SearchPaymentConfig = {}): Promise<
  FailedResponse | SuccessResponse<EnrollmentPayment>
> => {
  return API.get<EnrollmentPayment>({
    url: `${Routes.PAYMENT}/search`,
    config: { params: { startDateTime, endDateTime } }
  });
};

const EditPaymentTopUpBalance = (
  data: EditPaymentBalanceFormRequest
): Promise<FailedResponse | SuccessResponse<EnrollmentPayment>> => {
  return API.post<EnrollmentPayment>({
    url: `${Routes.PAYMENT}/edit`,
    config: { data }
  });
};

const GetPaymentInvoice = (
  id: number
): Promise<FailedResponse | SuccessResponse<EnrollmentPaymentInvoice>> => {
  return API.get<EnrollmentPaymentInvoice>({
    url: `${Routes.PAYMENT}/invoice/${id}`
  });
};

const RemovePayment = ({
  enrollmentPaymentId
}: RemovePaymentFormRequest): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.post<undefined>({
    url: `${Routes.PAYMENT}/remove`,
    config: { data: { enrollmentPaymentId } }
  });
};

export default {
  SearchPayments,
  EditPaymentTopUpBalance,
  GetPaymentInvoice,
  //   UpdateEnrollmentPayment,
  RemovePayment
};
