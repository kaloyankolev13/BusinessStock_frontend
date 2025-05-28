// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  firstName: string;
  lastName: string;
  twoFactorEnabled: boolean;
  lockoutEnd?: Date;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Firm {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxNumber?: string;
  validatedTaxNumber?: string;
  logoUrl?: string;
  defaultCurrencyId: number;
  defaultCurrency?: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFirm {
  id: number;
  userId: string;
  firmId: number;
  role: string;
  user?: User;
  firm?: Firm;
  createdAt: Date;
  updatedAt: Date;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
} 