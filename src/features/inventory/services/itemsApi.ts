import { api, buildQueryParams, createImportFunction, createExportFunction } from '../../../shared/utils/api';
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  ItemFilters,
  PaginationParams,
  PaginatedResponse,
  StockMovement,
  CreateStockMovementRequest,
  ApiResponse,
} from '../types';

const ITEMS_BASE_URL = '/Item';
const STOCK_MOVEMENTS_BASE_URL = '/stock-movements';

// Helper function to create paginated response
const createPaginatedResponse = <T>(
  data: T[],
  pagination?: PaginationParams
): PaginatedResponse<T> => {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: data.length,
    page,
    limit,
    totalPages: Math.ceil(data.length / limit),
  };
};

// Create shared import/export functions
const importItems = createImportFunction(ITEMS_BASE_URL);
const exportItems = createExportFunction(ITEMS_BASE_URL);

export const itemsApi = {
  // Get all items with filtering and pagination
  getItems: async (
    // filters?: ItemFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    // For now, get all items since backend returns array directly
    const response = await api.get<Item[]>(ITEMS_BASE_URL);
    
    // Transform the direct array response into paginated format
    const paginatedData = createPaginatedResponse(response.data, pagination);
    
    return {
      success: true,
      data: paginatedData,
    };
  },

  // Get single item by ID
  getItem: async (id: string): Promise<ApiResponse<Item>> => {
    return api.get<Item>(`${ITEMS_BASE_URL}/${id}`);
  },

  // Create new item
  createItem: async (data: CreateItemRequest): Promise<ApiResponse<Item>> => {
    return api.post<Item>(ITEMS_BASE_URL, data);
  },

  // Update existing item
  updateItem: async (data: UpdateItemRequest): Promise<ApiResponse<Item>> => {
    const { id, ...updateData } = data;
    return api.put<Item>(`${ITEMS_BASE_URL}/${id}`, updateData);
  },

  // Delete item
  deleteItem: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`${ITEMS_BASE_URL}/${id}`);
  },

  // Bulk delete items
  bulkDeleteItems: async (ids: string[]): Promise<ApiResponse<void>> => {
    return api.post<void>(`${ITEMS_BASE_URL}/bulk-delete`, { ids });
  },

  // Get items by category
  getItemsByCategory: async (
    categoryId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const response = await api.get<Item[]>(ITEMS_BASE_URL);
    
    // Filter by category on frontend for now
    const filteredData = response.data.filter(item => 
      item.categoryId?.toString() === categoryId
    );
    
    const paginatedData = createPaginatedResponse(filteredData, pagination);
    
    return {
      success: true,
      data: paginatedData,
    };
  },

  // Get items by supplier
  getItemsBySupplier: async (
    supplierId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const response = await api.get<Item[]>(ITEMS_BASE_URL);
    // Filter by supplier on frontend for now
    const filteredData = response.data.filter(item => 
      item.supplierId === supplierId
    );
    const paginatedData = createPaginatedResponse(filteredData, pagination);
    return {
      success: true,
      data: paginatedData,
    };
  },

  // Get low stock items
  getLowStockItems: async (
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const response = await api.get<Item[]>(ITEMS_BASE_URL);
    // Filter low stock items on frontend for now
    const filteredData = response.data.filter(item => {
      const stock = item.quantity || 0;
      const minLevel = item.minStockLevel || 5; // Default min level
      return stock <= minLevel;
    });
    const paginatedData = createPaginatedResponse(filteredData, pagination);
    return {
      success: true,
      data: paginatedData,
    };
  },

  // Search items by SKU or barcode
  searchItems: async (
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const response = await api.get<Item[]>(ITEMS_BASE_URL);
    
    // Search on frontend for now
    const filteredData = response.data.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sku?.toLowerCase().includes(query.toLowerCase()) ||
      (item.barcode && item.barcode.toLowerCase().includes(query.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    const paginatedData = createPaginatedResponse(filteredData, pagination);
    
    return {
      success: true,
      data: paginatedData,
    };
  },

  // Update item stock
  updateStock: async (
    itemId: string,
    quantity: number,
    reason?: string
  ): Promise<ApiResponse<Item>> => {
    return api.patch<Item>(`${ITEMS_BASE_URL}/${itemId}/stock`, {
      quantity,
      reason,
    });
  },

  // Get stock movements for an item
  getItemStockMovements: async (
    itemId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<StockMovement>>> => {
    const params = pagination || {};
    const queryString = buildQueryParams(params);
    const url = queryString 
      ? `${ITEMS_BASE_URL}/${itemId}/stock-movements?${queryString}`
      : `${ITEMS_BASE_URL}/${itemId}/stock-movements`;
    return api.get<PaginatedResponse<StockMovement>>(url);
  },

  // Create stock movement
  createStockMovement: async (
    data: CreateStockMovementRequest
  ): Promise<ApiResponse<StockMovement>> => {
    return api.post<StockMovement>(STOCK_MOVEMENTS_BASE_URL, data);
  },

  // Upload item image
  uploadItemImage: async (
    itemId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post<{ imageUrl: string }>(
      `${ITEMS_BASE_URL}/${itemId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );
  },

  // Delete item image
  deleteItemImage: async (itemId: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`${ITEMS_BASE_URL}/${itemId}/image`);
  },

  // Export items to CSV
  exportItems: exportItems as (filters?: ItemFilters) => Promise<ApiResponse<{ downloadUrl: string }>>,

  // Import items from CSV
  importItems: importItems,
}; 