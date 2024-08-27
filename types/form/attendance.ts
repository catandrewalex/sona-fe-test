import { Attendance, Teacher } from "@sonamusica-fe/types";
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
