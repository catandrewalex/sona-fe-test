import { Class, Course, Student, Teacher } from "@sonamusica-fe/types";

export type ClassInsertFormData = {
  teacher: Teacher | null;
  students: Student[];
  course: Course | null;
  transportFee: number;
};

export type ClassInsertFormRequest = {
  teacherId: number;
  studentIds: number[];
  courseId: number;
} & Pick<ClassInsertFormData, "transportFee">;

export type ClassUpdateFormData = ClassInsertFormData & {
  isActive: boolean;
};

export type ClassUpdateFormRequest = ClassInsertFormRequest &
  Pick<Class, "isDeactivated" | "classId">;

export type ClassDeleteRequest = {
  classId: number;
};
