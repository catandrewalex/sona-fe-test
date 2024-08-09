import { Course, Grade, Instrument } from "@sonamusica-fe/types";

export type CourseInsertFormData = {
  instrument: Instrument | null;
  grade: Grade | null;
} & Pick<Course, "defaultDurationMinute" | "defaultFee">;

export type CourseInsertFormRequest = {
  instrumentId: number;
  gradeId: number;
} & Pick<CourseInsertFormData, "defaultDurationMinute" | "defaultFee">;

export type CourseUpdateFormData = Omit<CourseInsertFormData, "courseId">;

export type CourseUpdateFormRequest = Omit<CourseInsertFormRequest, "instrumentId"> &
  Pick<Course, "courseId">;

export type CourseDeleteRequest = {
  courseId: number;
};
