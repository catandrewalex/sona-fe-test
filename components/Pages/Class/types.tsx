export type TabType = "status" | "token";

export interface StatusChange {
  classId: number;
  property: "isDeactivated" | "autoOweAttendanceToken";
  newValue: boolean;
}

export interface CourseChange {
  classId: number;
  newCourseId: number;
  newCourseName: string;
}

export interface SearchState {
  teacherName: string;
  studentName: string;
  courseName: string;
}

// Map types for changes
export type StatusChangeMap = Map<number, StatusChange>;
export type CourseChangeMap = Map<number, CourseChange>;
