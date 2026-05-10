export type UserRole = "ADMIN" | "CUSTOMER";

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}