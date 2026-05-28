import { UserRole } from '../types/user.types';

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.STAFF]: 'Staff',
  [UserRole.CUSTOMER]: 'Customer',
};

export const ADMIN_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.STAFF,
];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.CUSTOMER]: 0,
  [UserRole.STAFF]: 1,
  [UserRole.MANAGER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};
