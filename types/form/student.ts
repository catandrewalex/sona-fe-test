import { User } from "@sonamusica-fe/types";
import { UserInsertFormData, UserInsertFormRequest } from "@sonamusica-fe/types/form/user";

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
