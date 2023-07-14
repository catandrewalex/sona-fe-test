import { User } from "@sonamusica-fe/types";
import { UserInsertFormData, UserInsertFormRequest } from "@sonamusica-fe/types/form/user";

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
