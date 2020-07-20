export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string | null;
  createdAt: string;
  subscribers: number;
}

export interface UserWithToken {
  user: User;
  token: string;
}
