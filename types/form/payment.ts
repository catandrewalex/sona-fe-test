import { EnrollmentPaymentInvoice } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type RemovePaymentFormRequest = {
  enrollmentPaymentId: number;
};

export type EditPaymentBalanceFormData = {
  paymentDate: Moment;
  balanceBonus: number;
};

export type EditPaymentBalanceFormRequest = {
  enrollmentPaymentId: number;
  paymentDate: string;
  balanceBonus: number;
};

export type SubmitPaymentBalanceFormRequest = EnrollmentPaymentInvoice & {
  studentEnrollmentId: number;
  paymentDate: string;
};
