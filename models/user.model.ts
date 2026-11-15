export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  username: string;
  password: string;
  gender: string;
}

export interface UserResponse {
  id: number,
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  username: string;
  password: string;
  gender: string;
}

