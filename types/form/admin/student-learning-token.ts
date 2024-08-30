import { StudentLearningToken, StudentEnrollment } from "@sonamusica-fe/types";

// note that StudentLearningToken Insert/Update FormData uses [course|transport]FeeQuarterValue, instead of [course|transport]FeeValue.

export type StudentLearningTokenInsertFormData = Pick<StudentLearningToken, "quota"> & {
  courseFeeQuarterValue: number;
  transportFeeQuarterValue: number;
  studentEnrollment: StudentEnrollment | null;
};

export type StudentLearningTokenUpdateFormData = Pick<StudentLearningToken, "quota"> & {
  courseFeeQuarterValue: number;
  transportFeeQuarterValue: number;
};

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
