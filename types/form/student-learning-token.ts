import { StudentLearningToken, StudentEnrollment } from "@sonamusica-fe/types";

export type StudentLearningTokenInsertFormData = Omit<
  StudentLearningToken,
  "studentLearningTokenId" | "studentEnrollment" | "lastUpdatedAt"
> & {
  studentEnrollment: StudentEnrollment | null;
};

export type StudentLearningTokenUpdateFormData = Omit<
  StudentLearningToken,
  "studentEnrollment" | "studentLearningTokenId" | "lastUpdatedAt"
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
