import { Attendance, Student, StudentLearningToken, Teacher, Class } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type AttendanceInsertFormData = Omit<
  Attendance,
  "attendanceId" | "class" | "teacher" | "student" | "studentLearningToken" | "date"
> & {
  class: Class | null;
  teacher: Teacher | null;
  student: Student | null;
  studentLearningToken: StudentLearningToken | null;
  date: Moment;
};

export type AttendanceInsertFormRequest = Omit<
  Attendance,
  "attendanceId" | "class" | "teacher" | "student" | "studentLearningToken"
> & {
  classId: number;
  teacherId: number;
  studentId: number;
  studentLearningTokenId: number;
};

export type AttendanceUpdateFormData = AttendanceInsertFormData;

export type AttendanceUpdateFormRequest = AttendanceInsertFormRequest & {
  attendanceId: number;
};

export type AttendanceDeleteRequest = {
  attendanceId: number;
};
