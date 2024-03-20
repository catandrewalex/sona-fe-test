import { Course, Grade, Instrument } from "@sonamusica-fe/types";

export type CourseInsertFormData = Pick<Course, "defaultDurationMinute" | "defaultFee"> & {
  grade: Grade | null;
  instrument: Instrument | null;
};

export type CourseUpdateFormData = Omit<Course, "grade" | "instrument" | "courseId">;

export type CourseInsertFormRequest = Omit<CourseUpdateFormData, "courseId"> & {
  instrumentId: number;
  gradeId: number;
};

export type CourseUpdateFormRequest = CourseUpdateFormData & Pick<Course, "courseId">;

export type CourseDeleteRequest = {
  courseId: number;
};
