import { Presence, Student, StudentLearningToken, Teacher, Class } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type PresenceInsertFormData = Omit<
  Presence,
  "presenceId" | "class" | "teacher" | "student" | "studentLearningToken" | "date"
> & {
  class: Class | null;
  teacher: Teacher | null;
  student: Student | null;
  studentLearningToken: StudentLearningToken | null;
  date: Moment;
};

export type PresenceInsertFormRequest = Omit<
  Presence,
  "presenceId" | "class" | "teacher" | "student" | "studentLearningToken"
> & {
  classId: number;
  teacherId: number;
  studentId: number;
  studentLearningTokenId: number;
};

export type PresenceUpdateFormData = PresenceInsertFormData;

export type PresenceUpdateFormRequest = PresenceInsertFormRequest & {
  presenceId: number;
};

export type PresenceDeleteRequest = {
  presenceId: number;
};
