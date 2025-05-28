import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { itemsApi } from '../services';
import type {
  CreateItemRequest,
  UpdateItemRequest,
  ItemFilters,
  PaginationParams,
  CreateStockMovementRequest,
} from '../types';

// Query keys
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (filters?: ItemFilters, pagination?: PaginationParams) => 
    [...itemsKeys.lists(), { filters, pagination }] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemsKeys.details(), id] as const,
  lowStock: () => [...itemsKeys.all, 'lowStock'] as const,
  stockMovements: (itemId: string) => [...itemsKeys.all, 'stockMovements', itemId] as const,
  search: (query: string) => [...itemsKeys.all, 'search', query] as const,
  byCategory: (categoryId: string) => [...itemsKeys.all, 'byCategory', categoryId] as const,
  bySupplier: (supplierId: string) => [...itemsKeys.all, 'bySupplier', supplierId] as const,
};

// Get items with filtering and pagination
export const useItems = (filters?: ItemFilters, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: itemsKeys.list(filters, pagination),
    // TODO: Add filters to the query
    queryFn: () => itemsApi.getItems( pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single item
export const useItem = (id: string, enabled = true) => {
  return useQuery({
    queryKey: itemsKeys.detail(id),
    queryFn: () => itemsApi.getItem(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get low stock items
export const useLowStockItems = (pagination?: PaginationParams) => {
  return useQuery({
    queryKey: itemsKeys.lowStock(),
    queryFn: () => itemsApi.getLowStockItems(pagination),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for alerts)
  });
};

// Search items
export const useSearchItems = (query: string, pagination?: PaginationParams, enabled = true) => {
  return useQuery({
    queryKey: itemsKeys.search(query),
    queryFn: () => itemsApi.searchItems(query, pagination),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
};

// Get items by category
export const useItemsByCategory = (categoryId: string, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: itemsKeys.byCategory(categoryId),
    queryFn: () => itemsApi.getItemsByCategory(categoryId, pagination),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get items by supplier
export const useItemsBySupplier = (supplierId: string, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: itemsKeys.bySupplier(supplierId),
    queryFn: () => itemsApi.getItemsBySupplier(supplierId, pagination),
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get item stock movements
export const useItemStockMovements = (itemId: string, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: itemsKeys.stockMovements(itemId),
    queryFn: () => itemsApi.getItemStockMovements(itemId, pagination),
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000,
  });
};

// Create item mutation
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemRequest) => itemsApi.createItem(data),
    onSuccess: (response) => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      
      // Add the new item to the cache
      queryClient.setQueryData(
        itemsKeys.detail(response.data.id.toString()),
        response
      );

      toast.success('Item created successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create item';
      toast.error(message);
    },
  });
};

// Update item mutation
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateItemRequest) => itemsApi.updateItem(data),
    onSuccess: (response, variables) => {
      // Update the item in cache
      queryClient.setQueryData(
        itemsKeys.detail(variables.id.toString()),
        response
      );

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: itemsKeys.lowStock() });

      toast.success('Item updated successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to update item';
      toast.error(message);
    },
  });
};

// Delete item mutation
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsApi.deleteItem(id),
    onSuccess: (_, itemId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: itemsKeys.detail(itemId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: itemsKeys.lowStock() });

      toast.success('Item deleted successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete item';
      toast.error(message);
    },
  });
};

// Bulk delete items mutation
export const useBulkDeleteItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => itemsApi.bulkDeleteItems(ids),
    onSuccess: (_, itemIds) => {
      // Remove from cache
      itemIds.forEach(id => {
        queryClient.removeQueries({ queryKey: itemsKeys.detail(id) });
      });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: itemsKeys.lowStock() });

      toast.success(`${itemIds.length} items deleted successfully`);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete items';
      toast.error(message);
    },
  });
};

// Update stock mutation
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity, reason }: { 
      itemId: string; 
      quantity: number; 
      reason?: string; 
    }) => itemsApi.updateStock(itemId, quantity, reason),
    onSuccess: (response, variables) => {
      // Update the item in cache
      queryClient.setQueryData(
        itemsKeys.detail(variables.itemId),
        response
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: itemsKeys.lowStock() });
      queryClient.invalidateQueries({ 
        queryKey: itemsKeys.stockMovements(variables.itemId) 
      });

      toast.success('Stock updated successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to update stock';
      toast.error(message);
    },
  });
};

// Create stock movement mutation
export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockMovementRequest) => itemsApi.createStockMovement(data),
    onSuccess: (_, variables) => {
      // Invalidate stock movements for the item
      queryClient.invalidateQueries({ 
        queryKey: itemsKeys.stockMovements(variables.itemId.toString()) 
      });
      
      // Invalidate item details to update stock quantity
      queryClient.invalidateQueries({ 
        queryKey: itemsKeys.detail(variables.itemId.toString()) 
      });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: itemsKeys.lowStock() });

      toast.success('Stock movement recorded successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to record stock movement';
      toast.error(message);
    },
  });
};

// Upload item image mutation
export const useUploadItemImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, file, onProgress }: { 
      itemId: string; 
      file: File; 
      onProgress?: (progress: number) => void; 
    }) => itemsApi.uploadItemImage(itemId, file, onProgress),
    onSuccess: (response, variables) => {
      // Update the item in cache with new image URL
      queryClient.setQueryData(
        itemsKeys.detail(variables.itemId),
        (oldData: unknown) => {
          if (oldData && typeof oldData === 'object' && 'data' in oldData) {
            const typedOldData = oldData as { data: { imageUrl?: string } };
            return {
              ...oldData,
              data: {
                ...typedOldData.data,
                imageUrl: response.data.imageUrl,
              },
            };
          }
          return oldData;
        }
      );

      toast.success('Image uploaded successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(message);
    },
  });
};

// Export items mutation
export const useExportItems = () => {
  return useMutation({
    mutationFn: (filters?: ItemFilters) => itemsApi.exportItems(filters),
    onSuccess: (response) => {
      // Open download URL in new tab
      window.open(response.data.downloadUrl, '_blank');
      toast.success('Export started successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to export items';
      toast.error(message);
    },
  });
};

// Import items mutation
export const useImportItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: { 
      file: File; 
      onProgress?: (progress: number) => void; 
    }) => itemsApi.importItems(file, onProgress),
    onSuccess: (response) => {
      // Invalidate all items queries to refetch data
      queryClient.invalidateQueries({ queryKey: itemsKeys.all });

      const { imported, errors } = response.data;
      if (errors.length > 0) {
        toast.error(`Import completed with ${errors.length} errors. ${imported} items imported.`);
      } else {
        toast.success(`Successfully imported ${imported} items`);
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to import items';
      toast.error(message);
    },
  });
}; 