export type UserUpdateFormData = Pick<User, "username" | "privilegeType"> & {
  firstName: string;
  lastName?: string;
  email?: string;
};

export type UserInsertFormData = UserUpdateFormData & {
  password?: string;
  passwordConfirm?: string;
};

export type UserInsertFormRequest = Pick<User, "userDetail" | "username" | "privilegeType"> & {
  password?: string;
  email?: string;
};

export type UserUpdateFormRequest = Omit<User, "isDeactivated" | "createdAt" | "email"> & {
  email?: string;
};

export type TeacherInsertFormData = {
  userId: User | null;
} & UserInsertFormData;

export type TeacherInsertFormRequest = {
  userId: number;
};

export type TeacherInsertNewUserFormRequest = UserInsertFormRequest;

export type TeacherDeleteRequest = {
  teacherID: number;
};

export type StudentInsertFormData = {
  userId: User | null;
} & UserInsertFormData;

export type StudentInsertFormRequest = {
  userId: number;
};

export type StudentInsertNewUserFormRequest = UserInsertFormRequest;

export type StudentDeleteRequest = {
  studentID: number;
};

export interface User {
  userId: number;
  username: string;
  email: string;
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
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  name: string;
}
