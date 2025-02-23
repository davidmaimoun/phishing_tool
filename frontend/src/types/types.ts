
export interface Auth {
  username: string;
  password: string;
}

export interface User {
  username: string;
  authToken?: string;
}

export interface UserContextType {
  user: User | null;
  login: (username: string, authToken: string) => void;
  logout: () => void;
}