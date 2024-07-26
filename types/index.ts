export interface User {
  userId: number;
  username: string;
  email?: string;
  userDetail: UserDetail;
  privilegeType: UserType;
  isDeactivated: boolean;
  createdAt: Date;
}

export interface UserDetail {
  firstName: string;
  lastName?: string;
}

export interface UserTeachingInfo {
  teacherId: number;
  studentId: number;
  isTeacher: boolean;
  isStudent: boolean;
}

export interface LoginResponse {
  user: User;
  authToken: string;
}

export enum UserType {
  NONE = 0,
  ANONYMOUS = 100,
  MEMBER = 200,
  STAFF = 300,
  ADMIN = 400
}

export interface Teacher {
  teacherId: number;
  user: User;
}

export interface Student {
  studentId: number;
  user: User;
}

export interface Instrument {
  instrumentId: number;
  name: string;
}

export interface Grade {
  gradeId: number;
  name: string;
}

export interface Course {
  courseId: number;
  instrument: Instrument;
  grade: Grade;
  defaultFee: number;
  defaultDurationMinute: number;
}

export interface Class {
  classId: number;
  teacher?: Teacher;
  students: Student[];
  course: Course;
  transportFee: number;
  teacherSpecialFee?: number;
  isDeactivated: boolean;
}

export interface TeacherSpecialFee {
  teacherSpecialFeeId: number;
  teacher: Teacher;
  course: Course;
  fee: number;
}

export interface StudentEnrollment {
  studentEnrollmentId: number;
  student: Student;
  class: Class;
}

export interface StudentLearningToken {
  studentLearningTokenId: number;
  studentEnrollment: StudentEnrollment;
  quota: number;
  courseFeeValue: number;
  transportFeeValue: number;
  createdAt: string;
  lastUpdatedAt: string;
}

// StudentLearningTokenDisplay is a simplified version of StudentLearningToken, where only a subset of its information required, thus omitting the "studentEnrollment".
export type StudentLearningTokenDisplay = Omit<StudentLearningToken, "studentEnrollment">;

export interface StudentWithStudentLearningTokensDisplay {
  studentId: number;
  studentLearningTokens: StudentLearningTokenDisplay[];
}

export interface EnrollmentPayment {
  enrollmentPaymentId: number;
  studentEnrollment: StudentEnrollment;
  balanceTopUp: number;
  courseFeeValue: number;
  transportFeeValue: number;
  penaltyFeeValue: number;
  paymentDate: string;
}

export type EnrollmentPaymentInvoice = Omit<
  EnrollmentPayment,
  "enrollmentPaymentId" | "studentEnrollment" | "paymentDate"
> & {
  lastPaymentDate?: string;
  daysLate?: number;
};

export interface Attendance {
  attendanceId: number;
  class: Class;
  teacher: Teacher;
  student: Student;
  studentLearningToken: StudentLearningToken;
  date: string;
  usedStudentTokenQuota: number;
  duration: number;
  note: string;
  isPaid: boolean;
}

// PaginationResult is backend's direct output
export interface PaginationResult {
  totalPages: number;
  totalResults: number;
  currentPage: number;
}

export interface SearchClassConfig {
  studentId?: number;
  teacherId?: number;
  courseId?: number;
}

export type TeacherPaymentInvoiceItem = Omit<Class, "student"> & {
  students: Array<TeacherPaymentInvoiceItemStudent>;
};

export type TeacherPaymentInvoiceItemStudent = Pick<Student, "studentId" | "user"> & {
  studentLearningTokens: Array<TeacherPaymentInvoiceItemStudentLearningToken>;
};

export type TeacherPaymentInvoiceItemStudentLearningToken = Omit<
  StudentLearningToken,
  "studentEnrollment"
> & {
  attendances: Array<
    TeacherPaymentInvoiceItemAttendance | TeacherPaymentInvoiceItemAttendanceModify
  >;
};

export type TeacherPaymentInvoiceItemAttendance = Omit<
  Attendance,
  "class" | "student" | "studentLearningToken"
> & {
  grossCourseFeeValue: number;
  grossTransportFeeValue: number;
  courseFeeSharingPercentage: number;
  transportFeeSharingPercentage: number;
};

export type TeacherPaymentInvoiceItemAttendanceModify = TeacherPaymentInvoiceItemAttendance & {
  teacherPaymentId: number;
  paidCourseFeeValue: number;
  paidTransportFeeValue: number;
  addedAt: string;
};

export interface TeacherPaymentInvoiceItemSubmit {
  attendanceId: number;
  paidCourseFeeValue: number;
  paidTransportFeeValue: number;
}

export interface TeacherPaymentInvoiceItemModify {
  teacherPaymentId: number;
  paidCourseFeeValue: number;
  paidTransportFeeValue: number;
  isDeleted?: boolean;
  //TODO: optimize this!! these 2 fields are not used in backend API. we need this simply for rendering in TeacherPaymentDetails page
  grossCourseFeeValue: number;
  grossTransportFeeValue: number;
}

export interface TeacherPaymentUnpaidListItem {
  teacherId: number;
  user: User;
  totalAttendances: number;
}

export type TeacherPaymentPaidListItem = TeacherPaymentUnpaidListItem;

export interface DashboardChartBaseData {
  name: string;
  value: number;
}

export interface DashboardPieChartData {
  label: string;
  value: number;
  percentage?: number;
}

export interface DashboardTimeRangeFilterData {
  month: number;
  year: number;
}

export interface DashboardOverviewRequestBody {
  startDate: DashboardTimeRangeFilterData;
  endDate: DashboardTimeRangeFilterData;
}

export interface ExpenseDashboardOverviewRequestBody extends DashboardOverviewRequestBody {
  teacherIds: number[];
  instrumentIds: number[];
}

export interface ExpenseDashboardDetailRequestBody
  extends Pick<ExpenseDashboardOverviewRequestBody, "teacherIds" | "instrumentIds"> {
  selectedDate: DashboardTimeRangeFilterData;
}

//
// export interface IncomeDashboardOverviewRequestBody extends DashboardOverviewRequestBody {
//   studentIds: number[];
//   instrumentIds: number[];
// }

/**
 * A. Overview
 *
 * POST /dashboard/expense/overview
 *    body: {
 *      startDate: {
 *        month: 2,
 *        year: 2023
 *      },
 *      endDate: {
 *      month: 2,
 *      year: 2024,
 *      }
 *      teacherIds: [1,2,3,4,5,8] | []
 *      instrumentIds: [2,8,9] | []
 *    }
 *
 * RESPONSE: data: [
 *    {name: balbla, value: 2000}
 *  ]
 *
 * B. Detail
 *
 * POST /dashboard/expense/detail
 *    body: {
 *      selectedDate: {
 *        month: 2,
 *        year: 2024
 *      },
 *      teacherIds: [1,2,3,4,5,8] | []
 *      instrumentIds: [2,8,9] | []
 *    }
 *
 * RESPONSE: data: {
 *   instruments: [{name: asdfa, value: 23423, percentage: 39.4}],
 *   teachers: [{name: asdfasd, value: 134234, percentage: 2.4}]
 * }
 *
 */
