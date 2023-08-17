import { Moment } from "moment";

export type RemovePaymentFormRequest = {
  enrollmentPaymentId: number;
};

export type EditPaymentBalanceFormData = {
  paymentDate: Moment;
  balanceTopUp: number;
};

export type EditPaymentBalanceFormRequest = {
  enrollmentPaymentId: number;
  paymentDate: string;
  balanceTopUp: number;
};
