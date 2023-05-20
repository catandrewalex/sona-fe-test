export interface User {
  id: number;
  username: string;
  email: string;
  userDetail: UserDetail;
  privilegeType: UserType;
  isDeactivated: boolean;
  createdAt: Date;
}

export interface UserDetail {
  firstName: string;
  lastName: string;
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
