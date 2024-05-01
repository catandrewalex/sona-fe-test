import {
  TeacherPaymentInvoiceItem,
  TeacherPaymentInvoiceItemSubmit,
  TeacherPaymentUnpaidListItem
} from "@sonamusica-fe/types";
import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

type GetUnpaidTeacherPaymentByMonthAndYearConfig = GetRequestConfig & {
  month: number;
  year: number;
};

const GetUnpaidTeacherPaymentByMonthAndYear = ({
  month,
  year,
  page = 1,
  resultsPerPage = 1000
}: GetUnpaidTeacherPaymentByMonthAndYearConfig): Promise<
  FailedResponse | SuccessResponse<TeacherPaymentUnpaidListItem>
> => {
  return API.get<TeacherPaymentUnpaidListItem>({
    url: `${Routes.TEACHER_SALARY}/unpaidTeachers`,
    config: { params: { page, resultsPerPage, month, year } }
  });
};

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

export default {
  GetTeacherPaymentInvoice,
  SubmitTeacherPaymentInvoice,
  GetUnpaidTeacherPaymentByMonthAndYear
};
