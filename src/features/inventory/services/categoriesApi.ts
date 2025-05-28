import { api, buildQueryParams, createImportFunction, createExportFunction } from '../../../shared/utils/api';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilters,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

const CATEGORIES_BASE_URL = '/categories';

// Create shared import/export functions
const importCategories = createImportFunction(CATEGORIES_BASE_URL);
const exportCategories = createExportFunction(CATEGORIES_BASE_URL);

export const categoriesApi = {
  // Get all categories with filtering and pagination
  getCategories: async (
    filters?: CategoryFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    const params = { ...filters, ...pagination };
    const queryString = buildQueryParams(params);
    const url = queryString ? `${CATEGORIES_BASE_URL}?${queryString}` : CATEGORIES_BASE_URL;
    return api.get<PaginatedResponse<Category>>(url);
  },

  // Get all categories as a flat list (for dropdowns)
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    return api.get<Category[]>(`${CATEGORIES_BASE_URL}/all`);
  },

  // Get categories in hierarchical tree structure
  getCategoryTree: async (): Promise<ApiResponse<Category[]>> => {
    return api.get<Category[]>(`${CATEGORIES_BASE_URL}/tree`);
  },

  // Get single category by ID
  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    return api.get<Category>(`${CATEGORIES_BASE_URL}/${id}`);
  },

  // Get subcategories of a parent category
  getSubcategories: async (
    parentId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    const params = { parentCategoryId: parentId, ...pagination };
    const queryString = buildQueryParams(params);
    return api.get<PaginatedResponse<Category>>(`${CATEGORIES_BASE_URL}?${queryString}`);
  },

  // Create new category
  createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    return api.post<Category>(CATEGORIES_BASE_URL, data);
  },

  // Update existing category
  updateCategory: async (data: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
    const { id, ...updateData } = data;
    return api.put<Category>(`${CATEGORIES_BASE_URL}/${id}`, updateData);
  },

  // Delete category
  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`${CATEGORIES_BASE_URL}/${id}`);
  },

  // Bulk delete categories
  bulkDeleteCategories: async (ids: string[]): Promise<ApiResponse<void>> => {
    return api.post<void>(`${CATEGORIES_BASE_URL}/bulk-delete`, { ids });
  },

  // Reorder categories (update sort order)
  reorderCategories: async (
    categoryOrders: { id: string; sortOrder: number }[]
  ): Promise<ApiResponse<void>> => {
    return api.post<void>(`${CATEGORIES_BASE_URL}/reorder`, { categoryOrders });
  },

  // Move category to different parent
  moveCategory: async (
    categoryId: string,
    newParentId?: string
  ): Promise<ApiResponse<Category>> => {
    return api.patch<Category>(`${CATEGORIES_BASE_URL}/${categoryId}/move`, {
      parentCategoryId: newParentId,
    });
  },

  // Get category statistics
  getCategoryStats: async (id: string): Promise<ApiResponse<{
    itemCount: number;
    totalValue: number;
    subcategoryCount: number;
  }>> => {
    return api.get<{
      itemCount: number;
      totalValue: number;
      subcategoryCount: number;
    }>(`${CATEGORIES_BASE_URL}/${id}/stats`);
  },

  // Search categories
  searchCategories: async (
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    const params = { search: query, ...pagination };
    const queryString = buildQueryParams(params);
    return api.get<PaginatedResponse<Category>>(`${CATEGORIES_BASE_URL}/search?${queryString}`);
  },

  // Export categories to CSV
  exportCategories: exportCategories as (filters?: CategoryFilters) => Promise<ApiResponse<{ downloadUrl: string }>>,

  // Import categories from CSV
  importCategories: importCategories,
}; 