export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
}

export interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  contact?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
  };
}

export interface ApiError {
  error: string;
}
