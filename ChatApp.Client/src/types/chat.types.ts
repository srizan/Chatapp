export interface User {
  id?: number;
  username: string;
  email?: string;
  googleId?: string;
  profilePictureUrl?: string;
  createdAt?: string;
}

export interface Message {
  id?: number;
  userId?: number;
  user?: User;
  content: string;
  sentAt: string;
}

export interface ChatConfig {
  apiUrl: string;
  hubUrl: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  token: string;
}