export interface AppUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  providerId: string;
}

export interface RegisterPayload {
  phoneNumber: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
} 