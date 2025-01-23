import { Attendance, Class, Teacher } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type AddAttendanceFormData = Pick<
  Attendance,
  "usedStudentTokenQuota" | "duration" | "note"
> & {
  date: Moment;
  teacher: Teacher | null;
};

export type AddAttendanceFormRequest = Pick<
  Attendance,
  "usedStudentTokenQuota" | "duration" | "note"
> & {
  date: string;
  teacherId: number;
};

export type EditAttendanceFormData = AddAttendanceFormData;

export type EditAttendanceFormRequest = AddAttendanceFormRequest;

export type AttendanceDeleteRequest = {
  attendanceId: number;
};

// Add Attendance Batch
export type AddAttendanceBatchFormData = Pick<
  Attendance,
  "usedStudentTokenQuota" | "duration" | "note"
> & {
  class: Class | null;
  date: Moment;
  teacher: Teacher | null;
};

export type AddAttendanceBatchFormRequest = Pick<
  Attendance,
  "usedStudentTokenQuota" | "duration" | "note"
> & {
  classId: number;
  date: string;
  teacherId: number;
};

export interface AssignAttendanceTokenFormRequest {
  studentLearningTokenId: number;
}
