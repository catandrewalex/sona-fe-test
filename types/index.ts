export interface User {
  id: number;
  username: string;
  email: string;
  user_detail: Record<string, any>;
  privilege_type: number;
  is_deactivated: boolean;
  created_at: Date;
}
