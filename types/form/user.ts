import { User } from "@sonamusica-fe/types";

export type UserUpdateFormData = Pick<User, "username" | "privilegeType"> & {
  firstName: string;
  lastName?: string;
  email?: string;
  isActive: boolean;
};

export type UserInsertFormData = Omit<UserUpdateFormData, "isActive"> & {
  password?: string;
  passwordConfirm?: string;
};

export type UserInsertFormRequest = Pick<User, "userDetail" | "username" | "privilegeType"> & {
  password?: string;
  email?: string;
};

export type UserUpdateFormRequest = Omit<User, "createdAt" | "email"> & {
  email?: string;
};
