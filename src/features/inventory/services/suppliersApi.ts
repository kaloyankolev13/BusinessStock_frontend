import { api, buildQueryParams, createImportFunction, createExportFunction } from '../../../shared/utils/api';
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SupplierFilters,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

const SUPPLIERS_BASE_URL = '/inventory/suppliers';

// Create shared import/export functions
const importSuppliers = createImportFunction(SUPPLIERS_BASE_URL);
const exportSuppliers = createExportFunction(SUPPLIERS_BASE_URL);

export const suppliersApi = {
  // Get all suppliers with filtering and pagination
  getSuppliers: async (
    filters?: SupplierFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> => {
    const params = { ...filters, ...pagination };
    const queryString = buildQueryParams(params);
    const url = queryString ? `${SUPPLIERS_BASE_URL}?${queryString}` : SUPPLIERS_BASE_URL;
    return api.get<PaginatedResponse<Supplier>>(url);
  },

  // Get all suppliers as a flat list (for dropdowns)
  getAllSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
    return api.get<Supplier[]>(`${SUPPLIERS_BASE_URL}/all`);
  },

  // Get active suppliers only
  getActiveSuppliers: async (
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> => {
    const params = { isActive: true, ...pagination };
    const queryString = buildQueryParams(params);
    return api.get<PaginatedResponse<Supplier>>(`${SUPPLIERS_BASE_URL}?${queryString}`);
  },

  // Get single supplier by ID
  getSupplier: async (id: string): Promise<ApiResponse<Supplier>> => {
    return api.get<Supplier>(`${SUPPLIERS_BASE_URL}/${id}`);
  },

  // Create new supplier
  createSupplier: async (data: CreateSupplierRequest): Promise<ApiResponse<Supplier>> => {
    return api.post<Supplier>(SUPPLIERS_BASE_URL, data);
  },

  // Update existing supplier
  updateSupplier: async (data: UpdateSupplierRequest): Promise<ApiResponse<Supplier>> => {
    const { id, ...updateData } = data;
    return api.put<Supplier>(`${SUPPLIERS_BASE_URL}/${id}`, updateData);
  },

  // Delete supplier
  deleteSupplier: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`${SUPPLIERS_BASE_URL}/${id}`);
  },

  // Bulk delete suppliers
  bulkDeleteSuppliers: async (ids: string[]): Promise<ApiResponse<void>> => {
    return api.post<void>(`${SUPPLIERS_BASE_URL}/bulk-delete`, { ids });
  },

  // Toggle supplier active status
  toggleSupplierStatus: async (
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<Supplier>> => {
    return api.patch<Supplier>(`${SUPPLIERS_BASE_URL}/${id}/status`, { isActive });
  },

  // Get supplier statistics
  getSupplierStats: async (id: string): Promise<ApiResponse<{
    itemCount: number;
    totalPurchaseValue: number;
    averageLeadTime: number;
    lastOrderDate?: string;
  }>> => {
    return api.get<{
      itemCount: number;
      totalPurchaseValue: number;
      averageLeadTime: number;
      lastOrderDate?: string;
    }>(`${SUPPLIERS_BASE_URL}/${id}/stats`);
  },

  // Get suppliers by country
  getSuppliersByCountry: async (
    country: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> => {
    const params = { country, ...pagination };
    const queryString = buildQueryParams(params);
    return api.get<PaginatedResponse<Supplier>>(`${SUPPLIERS_BASE_URL}?${queryString}`);
  },

  // Search suppliers
  searchSuppliers: async (
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> => {
    const params = { search: query, ...pagination };
    const queryString = buildQueryParams(params);
    return api.get<PaginatedResponse<Supplier>>(`${SUPPLIERS_BASE_URL}/search?${queryString}`);
  },

  // Get supplier contact information
  getSupplierContacts: async (id: string): Promise<ApiResponse<{
    email?: string;
    phone?: string;
    contactPerson?: string;
    address?: string;
  }>> => {
    return api.get<{
      email?: string;
      phone?: string;
      contactPerson?: string;
      address?: string;
    }>(`${SUPPLIERS_BASE_URL}/${id}/contacts`);
  },

  // Update supplier contact information
  updateSupplierContacts: async (
    id: string,
    contacts: {
      email?: string;
      phone?: string;
      contactPerson?: string;
      address?: string;
      city?: string;
      country?: string;
      postalCode?: string;
    }
  ): Promise<ApiResponse<Supplier>> => {
    return api.patch<Supplier>(`${SUPPLIERS_BASE_URL}/${id}/contacts`, contacts);
  },

  // Get supplier performance metrics
  getSupplierPerformance: async (
    id: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<ApiResponse<{
    onTimeDeliveryRate: number;
    qualityRating: number;
    totalOrders: number;
    totalValue: number;
    averageOrderValue: number;
  }>> => {
    const params = { dateFrom, dateTo };
    const queryString = buildQueryParams(params);
    const url = queryString 
      ? `${SUPPLIERS_BASE_URL}/${id}/performance?${queryString}`
      : `${SUPPLIERS_BASE_URL}/${id}/performance`;
    return api.get<{
      onTimeDeliveryRate: number;
      qualityRating: number;
      totalOrders: number;
      totalValue: number;
      averageOrderValue: number;
    }>(url);
  },

  // Export suppliers to CSV
  exportSuppliers: exportSuppliers as (filters?: SupplierFilters) => Promise<ApiResponse<{ downloadUrl: string }>>,

  // Import suppliers from CSV
  importSuppliers: importSuppliers,
}; 