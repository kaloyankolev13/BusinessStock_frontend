import { create } from 'zustand';
import type { ItemFilters, PaginationParams } from '../types';

interface InventoryState {
  // Filters and search
  filters: ItemFilters;
  pagination: PaginationParams;
  
  // UI state
  selectedItems: number[];
  showFilters: boolean;
  viewMode: 'table' | 'grid';
  
  // Actions
  setFilters: (filters: Partial<ItemFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setSelectedItems: (items: number[]) => void;
  toggleItemSelection: (itemId: number) => void;
  clearSelection: () => void;
  toggleFilters: () => void;
  setViewMode: (mode: 'table' | 'grid') => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  // Initial state
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  },
  selectedItems: [],
  showFilters: false,
  viewMode: 'table',
  
  // Actions
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 } // Reset to first page when filtering
  })),
  
  clearFilters: () => set({
    filters: {},
    pagination: { ...get().pagination, page: 1 }
  }),
  
  setSearchQuery: (query) => set((state) => ({
    filters: { ...state.filters, search: query },
    pagination: { ...state.pagination, page: 1 }
  })),
  
  setPagination: (newPagination) => set((state) => ({
    pagination: { ...state.pagination, ...newPagination }
  })),
  
  setSelectedItems: (items) => set({ selectedItems: items }),
  
  toggleItemSelection: (itemId) => set((state) => ({
    selectedItems: state.selectedItems.includes(itemId)
      ? state.selectedItems.filter(id => id !== itemId)
      : [...state.selectedItems, itemId]
  })),
  
  clearSelection: () => set({ selectedItems: [] }),
  
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  
  setViewMode: (mode) => set({ viewMode: mode }),
})); 