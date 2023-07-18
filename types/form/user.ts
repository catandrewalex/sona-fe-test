import { User } from "@sonamusica-fe/types";

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
