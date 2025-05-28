// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common filter types
export interface BaseFilters extends Record<string, unknown> {
  search?: string;
  isActive?: boolean;
}

// Sort options
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
} 