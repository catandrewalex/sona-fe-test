import { User } from "@sonamusica-fe/types";
import { Moment } from "moment";

export type UserUpdateFormData = Pick<User, "username" | "privilegeType"> & {
  firstName: string;
  lastName?: string;
  email?: string;
  isActive: boolean;

  birthdate?: Moment;
  address?: string;
  phoneNumber?: string;
  instagramAccount?: string;
  twitterAccount?: string;
  parentName?: string;
  parentPhoneNumber?: string;
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
