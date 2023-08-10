import { EnrollmentPayment, StudentEnrollment } from "@sonamusica-fe/types";

export type EnrollmentPaymentInsertFormData = Omit<
  EnrollmentPayment,
  "enrollmentPaymentId" | "studentEnrollment"
> & {
  studentEnrollment: StudentEnrollment | null;
};

export type EnrollmentPaymentUpdateFormData = Omit<
  EnrollmentPayment,
  "studentEnrollment" | "enrollmentPaymentId"
>;

export type EnrollmentPaymentInsertFormRequest = Omit<
  EnrollmentPaymentInsertFormData,
  "studentEnrollment"
> & {
  studentEnrollmentId: number;
};

export type EnrollmentPaymentUpdateFormRequest = Omit<EnrollmentPayment, "studentEnrollment">;

export type EnrollmentPaymentDeleteRequest = {
  enrollmentPaymentId: number;
};
