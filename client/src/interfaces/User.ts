export interface Credentials {
  username: string;
  password: string;
}

export interface UpdateUser {
  description?: string;
  username?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string | null;
  createdAt: string;
  subscribers: number;
  description: string;
  banner: string;
}

export interface UserWithToken {
  user: User;
  token: string;
}
