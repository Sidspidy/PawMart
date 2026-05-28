// ── User ──────────────────────────────────────────────────────────────────────
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export interface IAddress {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  addresses: IAddress[];
  pointsBalance: number;
  totalSpins: number;
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}
