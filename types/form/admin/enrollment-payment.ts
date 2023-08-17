import { EnrollmentPayment, StudentEnrollment } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type EnrollmentPaymentInsertFormData = Omit<
  EnrollmentPayment,
  "enrollmentPaymentId" | "studentEnrollment" | "paymentDate"
> & {
  studentEnrollment: StudentEnrollment | null;
  paymentDate: Moment;
};

export type EnrollmentPaymentUpdateFormData = Omit<
  EnrollmentPayment,
  "studentEnrollment" | "enrollmentPaymentId" | "paymentDate"
> & {
  paymentDate: Moment;
};

export type EnrollmentPaymentInsertFormRequest = Omit<
  EnrollmentPaymentInsertFormData,
  "studentEnrollment" | "paymentDate"
> & {
  studentEnrollmentId: number;
  paymentDate: string;
};

export type EnrollmentPaymentUpdateFormRequest = Omit<EnrollmentPayment, "studentEnrollment">;

export type EnrollmentPaymentDeleteRequest = {
  enrollmentPaymentId: number;
};
