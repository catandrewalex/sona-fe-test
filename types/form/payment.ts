import { EnrollmentPaymentInvoice } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type RemovePaymentFormRequest = {
  enrollmentPaymentId: number;
};

export type EditPaymentSafeAttributesFormData = {
  paymentDate: Moment;
  balanceBonus: number;
  discountFeeValue: number;
};

export type EditPaymentSafeAttributesFormRequest = {
  enrollmentPaymentId: number;
  paymentDate: string;
  balanceBonus: number;
  discountFeeValue: number;
};

export type SubmitPaymentSafeAttributesFormRequest = EnrollmentPaymentInvoice & {
  studentEnrollmentId: number;
  paymentDate: string;
};
