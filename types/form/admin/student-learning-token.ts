import { StudentLearningToken, StudentEnrollment } from "@sonamusica-fe/types";

export type StudentLearningTokenInsertFormData = Pick<
  StudentLearningToken,
  "quota" | "courseFeeValue" | "transportFeeValue"
> & {
  studentEnrollment: StudentEnrollment | null;
};

export type StudentLearningTokenUpdateFormData = Pick<
  StudentLearningToken,
  "quota" | "courseFeeValue" | "transportFeeValue"
>;

export type StudentLearningTokenInsertFormRequest = Omit<
  StudentLearningTokenInsertFormData,
  "studentEnrollment"
> & {
  studentEnrollmentId: number;
};

export type StudentLearningTokenUpdateFormRequest = StudentLearningTokenUpdateFormData &
  Pick<StudentLearningToken, "studentLearningTokenId">;

export type StudentLearningTokenDeleteRequest = {
  studentLearningTokenId: number;
};
