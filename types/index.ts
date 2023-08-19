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
  lastUpdatedAt: string;
}

export interface EnrollmentPayment {
  enrollmentPaymentId: number;
  studentEnrollment: StudentEnrollment;
  balanceTopUp: number;
  courseFeeValue: number;
  transportFeeValue: number;
  valuePenalty: number;
  paymentDate: string;
}

export type EnrollmentPaymentInvoice = Omit<
  EnrollmentPayment,
  "enrollmentPaymentId" | "studentEnrollment" | "paymentDate"
>;
