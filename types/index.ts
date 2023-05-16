export interface User {
  id: number;
  username: string;
  email: string;
  user_detail: UserDetail;
  privilege_type: number;
  is_deactivated: boolean;
  created_at: Date;
}

export interface UserDetail {
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
  authToken: string;
}
