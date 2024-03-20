import { Course, Teacher, TeacherSpecialFee } from "@sonamusica-fe/types";

export type TeacherSpecialFeeInsertFormData = {
  teacher: Teacher | null;
  course: Course | null;
  fee: number;
};

export type TeacherSpecialFeeInsertFormRequest = {
  teacherId: number;
  courseId: number;
} & Pick<TeacherSpecialFeeInsertFormData, "fee">;

export type TeacherSpecialFeeUpdateFormData = Pick<TeacherSpecialFee, "fee">;

export type TeacherSpecialFeeUpdateFormRequest = TeacherSpecialFeeUpdateFormData &
  Pick<TeacherSpecialFee, "teacherSpecialFeeId">;

export type TeacherSpecialFeeDeleteRequest = {
  teacherSpecialFeeId: number;
};
