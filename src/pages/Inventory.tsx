import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  AlertTriangle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  useItems, 
  useLowStockItems, 
//   useCreateItem, 
//   useUpdateItem, 
  useDeleteItem,
  useExportItems,
  useImportItems
} from '../features/inventory';
import { formatCurrency, formatDate } from '../shared/utils';
import type { ItemFilters, PaginationParams } from '../features/inventory';

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ItemFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks
  const { data: itemsData, isLoading, error } = useItems(filters, pagination);
  const { data: lowStockData } = useLowStockItems({ page: 1, limit: 5 });
//   const createItemMutation = useCreateItem();
//   const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const exportItemsMutation = useExportItems();
  const importItemsMutation = useImportItems();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<ItemFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleExport = () => {
    exportItemsMutation.mutate(filters);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importItemsMutation.mutate({ file });
    }
  };

  const handleDeleteItem = (itemId: number) => {  
    if (window.confirm(t('inventory.confirmDelete'))) {
      deleteItemMutation.mutate(itemId.toString());
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">
              {t('common.error')}: {error instanceof Error ? error.message : 'Unknown error'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            {t('inventory.title')}
          </h1>
          <p className="text-gray-600 mt-1">{t('inventory.description')}</p>
        </div>
        <div className="flex space-x-3">
          <label className="btn btn-outline cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {t('inventory.import')}
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleImport}
              className="hidden"
              disabled={importItemsMutation.isPending}
            />
          </label>
          <button
            onClick={handleExport}
            disabled={exportItemsMutation.isPending}
            className="btn btn-outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('inventory.export')}
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            {t('inventory.addItem')}
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockData?.data.data && lowStockData.data.data.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-800 font-medium">
              {t('inventory.lowStockAlert', { count: lowStockData.data.total })}
            </span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('inventory.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.categoryId || ''}
              onChange={(e) => handleFilterChange({ categoryId: e.target.value || undefined })}
              className="select select-bordered"
            >
              <option value="">{t('inventory.allCategories')}</option>
              {/* Categories would be loaded from API */}
            </select>
            <select
              value={filters.isActive?.toString() || ''}
              onChange={(e) => handleFilterChange({ 
                isActive: e.target.value ? e.target.value === 'true' : undefined 
              })}
              className="select select-bordered"
            >
              <option value="">{t('inventory.allStatuses')}</option>
              <option value="true">{t('common.active')}</option>
              <option value="false">{t('common.inactive')}</option>
            </select>
            <button className="btn btn-outline">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-2 text-gray-600">{t('common.loading')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>{t('inventory.fields.name')}</th>
                    <th>{t('inventory.fields.sku')}</th>
                    <th>{t('inventory.fields.category')}</th>
                    <th>{t('inventory.fields.stock')}</th>
                    <th>{t('inventory.fields.price')}</th>
                    <th>Firm</th>
                    <th>Created</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsData?.data.data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {item.description}
                              </div>
                            )}
                            {item.isComposite && (
                              <span className="badge badge-info badge-sm">Composite</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-sm">{item.sku || '-'}</td>
                      <td>{item.categoryName || item.category?.name || '-'}</td>
                      <td>
                        <div className="flex items-center">
                          <span className={`font-medium ${
                            item.quantity <= (item.minStockLevel || 5)
                              ? 'text-red-600' 
                              : 'text-gray-900'
                          }`}>
                            {item.quantity}
                          </span>
                          <span className="text-gray-500 ml-1">{item.unitOfMeasure || 'pcs'}</span>
                          {item.quantity <= (item.minStockLevel || 5) && (
                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-medium">
                          {formatCurrency(item.price, item.currency?.code || 'BGN')}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-gray-600">
                          {item.firmName || item.firm?.name}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                            disabled={deleteItemMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {itemsData?.data && itemsData.data.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  {t('common.pagination.showing', {
                    start: (pagination.page - 1) * pagination.limit + 1,
                    end: Math.min(pagination.page * pagination.limit, itemsData.data.total),
                    total: itemsData.data.total
                  })}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="btn btn-sm btn-outline"
                  >
                    {t('common.pagination.previous')}
                  </button>
                  <span className="flex items-center px-3 text-sm">
                    {pagination.page} / {itemsData.data.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === itemsData.data.totalPages}
                    className="btn btn-sm btn-outline"
                  >
                    {t('common.pagination.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory; 