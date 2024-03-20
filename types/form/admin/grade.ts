import { Grade } from "@sonamusica-fe/types";

export type GradeUpsertFormData = Omit<Grade, "gradeId">;

export type GradeInsertFormRequest = GradeUpsertFormData;

export type GradeUpdateFormRequest = Grade;

export type GradeDeleteRequest = {
  gradeId: number;
};
