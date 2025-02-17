export interface AppUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  providerId: string;
  district: string;
  tieuKhu: string;
}

export interface RegisterPayload {
  phoneNumber: string;
  password: string;
  name: string;
  birthYear: number;
  gender: 'male' | 'female' | 'other';
  tieuKhu: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
} 