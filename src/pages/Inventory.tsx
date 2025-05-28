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
  useDeleteItem,
  useExportItems,
  useImportItems,
  useInventoryStore
} from '../features/inventory';
import { formatCurrency } from '../shared/utils';

const Inventory = () => {
  const { t } = useTranslation();
  
  // Zustand store
  const {
    filters,
    pagination,
    selectedItems,
    showFilters,
    viewMode,
    setFilters,
    setSearchQuery,
    setPagination,
    toggleItemSelection,
    clearSelection,
    toggleFilters,
    setViewMode,
    setSelectedItems,
  } = useInventoryStore();

  // API hooks
  const { data: itemsData, isLoading, error } = useItems(filters, pagination);
  const { data: lowStockData } = useLowStockItems({ page: 1, limit: 5 });
  const deleteItemMutation = useDeleteItem();
  const exportItemsMutation = useExportItems();
  const importItemsMutation = useImportItems();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
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

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(t('inventory.confirmBulkDelete', { count: selectedItems.length }))) {
      selectedItems.forEach(itemId => {
        deleteItemMutation.mutate(itemId.toString());
      });
      clearSelection();
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
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
          </div>
          
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

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {t('inventory.selectedItems', { count: selectedItems.length })}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={clearSelection}
                className="btn btn-outline btn-sm"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
            </div>
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
                value={filters.search || ''}
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
            <button 
              onClick={toggleFilters}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input input-bordered flex-1"
                    onChange={(e) => handleFilterChange({ 
                      priceMin: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input input-bordered flex-1"
                    onChange={(e) => handleFilterChange({ 
                      priceMax: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Level
                </label>
                <select
                  onChange={(e) => handleFilterChange({ stockLevel: e.target.value || undefined })}
                  className="select select-bordered w-full"
                >
                  <option value="">All Levels</option>
                  <option value="low">Low Stock</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  onChange={(e) => handleFilterChange({ supplierId: e.target.value || undefined })}
                  className="select select-bordered w-full"
                >
                  <option value="">All Suppliers</option>
                  {/* Suppliers would be loaded from API */}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Items Table/Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-2 text-gray-600">{t('common.loading')}</p>
          </div>
        ) : viewMode === 'table' ? (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Select all visible items
                            const allIds = itemsData?.data.data.map(item => item.id) || [];
                            setSelectedItems(allIds);
                          } else {
                            clearSelection();
                          }
                        }}
                      />
                    </th>
                    <th>{t('inventory.fields.name')}</th>
                    <th>{t('inventory.fields.sku')}</th>
                    <th>{t('inventory.fields.category')}</th>
                    <th>{t('inventory.fields.price')}</th>
                    <th>{t('inventory.fields.stock')}</th>
                    <th>{t('inventory.fields.status')}</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsData?.data.data.map((item) => (
                    <tr key={item.sku}>
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                        />
                      </td>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img 
                                src="https://placehold.co/600x400" 
                                alt={item.name}
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-item.png';
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-sm opacity-50">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.sku}</td>
                      <td>{item.category?.name || '-'}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>
                        <span className={`badge ${
                          item.quantity <= (item.minStockLevel || 5)
                            ? 'badge-error' 
                            : item.quantity <= (item.minStockLevel || 5) * 2
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${item.isActive ? 'badge-success' : 'badge-error'}`}>
                          {item.isActive ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-xs">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn btn-ghost btn-xs text-red-600"
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
            {itemsData?.data && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, itemsData.data.total)} of{' '}
                  {itemsData.data.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="btn btn-outline btn-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= itemsData.data.totalPages}
                    className="btn btn-outline btn-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Grid View
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsData?.data.data.map((item) => (
                <div key={item.id} className="card bg-base-100 shadow-md">
                  <figure className="px-4 pt-4">
                    <img 
                      src="https://placehold.co/600x400" 
                      alt={item.name}
                      className="rounded-xl h-32 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-item.png';
                      }}
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">{item.sku}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">{formatCurrency(item.price)}</span>
                      <span className={`badge badge-sm ${
                        item.quantity <= (item.minStockLevel || 5)
                          ? 'badge-error' 
                          : 'badge-success'
                      }`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <button className="btn btn-ghost btn-xs">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button className="btn btn-ghost btn-xs">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="btn btn-ghost btn-xs text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory; 