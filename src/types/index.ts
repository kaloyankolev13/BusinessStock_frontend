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

export interface Category {
  id: number;
  name: string;
  description?: string;
  firmId: number;
  firm?: Firm;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  preferredCurrencyId?: number;
  preferredCurrency?: Currency;
  firmId: number;
  firm?: Firm;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  price: number;
  currencyId: number;
  currency?: Currency;
  quantity: number;
  categoryId?: number;
  category?: Category;
  sku?: string;
  isComposite: boolean;
  firmId: number;
  firm?: Firm;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemSupplier {
  id: number;
  itemId: number;
  item?: Item;
  supplierId: number;
  supplier?: Supplier;
  purchasePrice: number;
  currencyId: number;
  currency?: Currency;
  supplierSku?: string;
  lastPurchaseDate?: Date;
  leadTimeDays?: number;
  minimumOrderQuantity?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemComposition {
  id: number;
  parentItemId: number;
  parentItem?: Item;
  componentItemId: number;
  componentItem?: Item;
  quantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  preferredCurrencyId?: number;
  preferredCurrency?: Currency;
  firmId: number;
  firm?: Firm;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: number;
  clientId?: number;
  client?: Client;
  invoiceDate: Date;
  invoiceNumber: string;
  currencyId: number;
  currency?: Currency;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentTerms?: string;
  dueDate?: Date;
  firmId: number;
  firm?: Firm;
  items?: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  invoice?: Invoice;
  itemId?: number;
  item?: Item;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplier?: Supplier;
  poNumber: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  currencyId: number;
  currency?: Currency;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentTerms?: string;
  notes?: string;
  firmId: number;
  firm?: Firm;
  items?: PurchaseOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  purchaseOrder?: PurchaseOrder;
  itemId: number;
  item?: Item;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
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