import { ICustomer } from './Customer.model';
import { IAdmin } from './Admin.model';

export type IUser = ICustomer | IAdmin;

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}
