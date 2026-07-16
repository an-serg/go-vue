// src/types/auth.ts
export interface RegisterFormData {
  nick: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
  }
}

export type LoginField = 'email' | 'password'

export interface LoginErrors {
  email: string
  password: string
}

export type RegisterField = 'email' | 'password'

export interface RegisterErrors {
  nick: string
  username: string
  email: string
  password: string
  confirmPassword:string
}
