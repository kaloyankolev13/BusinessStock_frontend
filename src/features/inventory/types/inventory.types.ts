import type { Currency, Firm } from '../../../shared/types/common.types';
import type { BaseFilters } from '../../../shared/types/api.types';

// Re-export commonly used types from shared
export type { PaginationParams, PaginatedResponse, ApiResponse, ApiError } from '../../../shared/types/api.types';

// Base types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  firmId: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  firmId: number;
  firm?: Firm;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

// Supplier types
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

export interface CreateSupplierRequest {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  preferredCurrencyId?: number;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: number;
}

// Item types - Using your actual database schema
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
  supplierId?: string;
  // Additional fields for display (from API response)
  categoryName?: string;
  firmName?: string;
  
  // Optional inventory management fields
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  unitOfMeasure?: string;
  barcode?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  price: number;
  currencyId: number;
  quantity?: number;
  categoryId?: number;
  sku?: string;
  isComposite?: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  unitOfMeasure?: string;
  barcode?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  id: number;
}

// Item-Supplier relationship
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

// Item composition for composite items
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

// Stock movement types
export interface StockMovement {
  id: number;
  itemId: number;
  item?: Item;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  referenceNumber?: string;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStockMovementRequest {
  itemId: number;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  reason?: string;
  referenceNumber?: string;
  notes?: string;
}

// Filter types extending base filters
export interface ItemFilters extends BaseFilters {
  categoryId?: string;
  supplierId?: string;
  isLowStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  currencyId?: number;
  isComposite?: boolean;
  priceMin?: number;
  priceMax?: number;
  stockLevel?: string;
}

export type CategoryFilters = BaseFilters;

export interface SupplierFilters extends BaseFilters {
  country?: string;
}

// Stock alert types
export interface StockAlert {
  id: string;
  itemId: number;
  item: Item;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
  currentStock: number;
  threshold: number;
  createdAt: string;
  isResolved: boolean;
}

// Inventory summary types
export interface InventorySummary {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalCategories: number;
  totalSuppliers: number;
  recentMovements: StockMovement[];
  topSellingItems: Item[];
  stockAlerts: StockAlert[];
} 