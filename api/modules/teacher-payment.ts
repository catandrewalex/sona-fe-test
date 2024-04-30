import { TeacherPaymentInvoiceItem, TeacherPaymentInvoiceItemSubmit } from "@sonamusica-fe/types";
import API, { FailedResponse, Routes, SuccessResponse } from "api";

const GetTeacherPaymentInvoice = (
  id: number
): Promise<FailedResponse | SuccessResponse<TeacherPaymentInvoiceItem>> => {
  return API.get<TeacherPaymentInvoiceItem>({
    url: `${Routes.TEACHER_SALARY}/invoiceItems/teacher/${id}`
  });
};

const SubmitTeacherPaymentInvoice = (
  data: TeacherPaymentInvoiceItemSubmit[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.post<undefined>({
    url: `${Routes.TEACHER_SALARY}/submit`,
    config: { data: { data } }
  });
};

export default { GetTeacherPaymentInvoice, SubmitTeacherPaymentInvoice };
