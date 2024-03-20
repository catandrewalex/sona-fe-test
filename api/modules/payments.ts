import { EnrollmentPayment, EnrollmentPaymentInvoice } from "@sonamusica-fe/types";
import {
  EditPaymentBalanceFormRequest,
  RemovePaymentFormRequest,
  SubmitPaymentBalanceFormRequest
} from "@sonamusica-fe/types/form/payment";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

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

const SubmitPayment = (
  data: SubmitPaymentBalanceFormRequest
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.post<undefined>({
    url: `${Routes.PAYMENT}/submit`,
    config: { data }
  });
};

export default {
  SearchPayments,
  EditPaymentTopUpBalance,
  GetPaymentInvoice,
  SubmitPayment,
  RemovePayment
};
