export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type User = {
  id: string;
  name: string;
  email: string;
  role?: Role;
  createdAt: string;
  updatedAt?: string;
};
