import {
  TeacherPaymentInvoiceItem,
  TeacherPaymentInvoiceItemModify,
  TeacherPaymentInvoiceItemSubmit,
  TeacherPaymentPaidListItem,
  TeacherPaymentUnpaidListItem
} from "@sonamusica-fe/types";
import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

type GetUnpaidTeacherPaymentByMonthAndYearConfig = GetRequestConfig & {
  month?: number;
  year?: number;
};

type GetPaidTeacherPaymentByMonthAndYearConfig = GetUnpaidTeacherPaymentByMonthAndYearConfig;

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

const GetPaidTeacherPaymentByMonthAndYear = ({
  month,
  year,
  page = 1,
  resultsPerPage = 1000
}: GetPaidTeacherPaymentByMonthAndYearConfig): Promise<
  FailedResponse | SuccessResponse<TeacherPaymentPaidListItem>
> => {
  return API.get<TeacherPaymentPaidListItem>({
    url: `${Routes.TEACHER_SALARY}/paidTeachers`,
    config: { params: { page, resultsPerPage, month, year } }
  });
};

const GetTeacherPaymentInvoice = (
  id: number,
  year?: number,
  month?: number
): Promise<FailedResponse | SuccessResponse<TeacherPaymentInvoiceItem>> => {
  return API.get<TeacherPaymentInvoiceItem>({
    url: `${Routes.TEACHER_SALARY}/invoiceItems/teacher/${id}`,
    config: { params: { year, month } }
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

const ModifyTeacherPaymentInvoice = (
  data: TeacherPaymentInvoiceItemModify[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.post<undefined>({
    url: `${Routes.TEACHER_SALARY}/modify`,
    config: { data: { data } }
  });
};

const GetPaidTeacherPaymentInvoice = (
  id: number,
  year?: number,
  month?: number
): Promise<FailedResponse | SuccessResponse<TeacherPaymentInvoiceItem>> => {
  return API.get<TeacherPaymentInvoiceItem>({
    url: `${Routes.TEACHER_SALARY}/teacher/${id}`,
    config: { params: { year, month } }
  });
};

export default {
  GetTeacherPaymentInvoice,
  GetPaidTeacherPaymentInvoice,
  SubmitTeacherPaymentInvoice,
  ModifyTeacherPaymentInvoice,
  GetPaidTeacherPaymentByMonthAndYear,
  GetUnpaidTeacherPaymentByMonthAndYear
};
