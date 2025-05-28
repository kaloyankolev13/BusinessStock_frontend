# Business Management ERP - Frontend

A modern React frontend for a multi-firm business management ERP system built with TypeScript, React Query, and Tailwind CSS.

## 🏗️ Architecture

This project follows a **feature-based architecture** that promotes modularity, maintainability, and scalability.

### Directory Structure

```
src/
├── features/                     # Feature-based modules
│   ├── inventory/                # Inventory management
│   │   ├── components/           # Feature-specific components
│   │   ├── hooks/                # React Query hooks
│   │   ├── services/             # API services
│   │   ├── types/                # TypeScript types
│   │   └── index.ts              # Feature exports
│   ├── sales/                    # Sales management (planned)
│   ├── purchasing/               # Purchase management (planned)
│   └── company/                  # Company/Firm management (planned)
├── shared/                       # Shared/Common modules
│   ├── components/               # Reusable UI components
│   ├── hooks/                    # Shared custom hooks
│   ├── utils/                    # Utility functions
│   ├── types/                    # Shared type definitions
│   └── constants/                # Application constants
├── components/                   # Layout components
├── pages/                        # Page components
└── locales/                      # Internationalization
```

## 🚀 Features

### ✅ Implemented
- **Inventory Management API**
  - Items CRUD operations
  - Categories management
  - Suppliers management
  - Stock movements tracking
  - Low stock alerts
  - Import/Export functionality
  - Image upload support
  - Advanced filtering and pagination

- **React Query Integration**
  - Optimistic updates
  - Intelligent caching
  - Background refetching
  - Error handling
  - Loading states

- **TypeScript Support**
  - Comprehensive type definitions
  - Type-safe API calls
  - IntelliSense support

- **Internationalization**
  - English and Bulgarian support
  - Dynamic language switching
  - Comprehensive translations

### 🔄 Planned
- Sales management
- Purchase orders
- Company/Firm management
- User management
- Reporting system

## 📦 Inventory API

### Types

```typescript
// Core entities
interface Item {
  id: string;
  name: string;
  sku: string;
  categoryId?: string;
  supplierId?: string;
  stockQuantity: number;
  sellingPrice: number;
  // ... more fields
}

interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  isActive: boolean;
  // ... more fields
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  // ... more fields
}
```

### API Services

```typescript
// Items API
import { itemsApi } from 'features/inventory';

// Get items with filtering and pagination
const items = await itemsApi.getItems(filters, pagination);

// CRUD operations
const newItem = await itemsApi.createItem(itemData);
const updatedItem = await itemsApi.updateItem(updateData);
await itemsApi.deleteItem(itemId);

// Stock management
const updatedItem = await itemsApi.updateStock(itemId, quantity, reason);
const movements = await itemsApi.getItemStockMovements(itemId);

// File operations
const result = await itemsApi.uploadItemImage(itemId, file);
const exportUrl = await itemsApi.exportItems(filters);
```

### React Query Hooks

```typescript
import { 
  useItems, 
  useItem, 
  useCreateItem, 
  useUpdateItem, 
  useDeleteItem,
  useLowStockItems 
} from 'features/inventory';

// In your component
function InventoryPage() {
  const { data: items, isLoading } = useItems(filters, pagination);
  const { data: lowStockItems } = useLowStockItems();
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  // Mutations automatically handle cache updates and notifications
  const handleCreate = (itemData) => {
    createMutation.mutate(itemData);
  };
}
```

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Query (TanStack Query)** - Server state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React i18next** - Internationalization
- **Lucide React** - Icons

## 🔧 API Configuration

### Environment Variables

```env
VITE_API_BASE_URL=https://localhost:7001/api
```

### Authentication

The API client automatically handles:
- JWT token attachment
- Firm ID headers
- Token refresh
- Unauthorized redirects

```typescript
// API client configuration
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Firm-Id': firmId
  }
});
```

## 📊 State Management

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});
```

### Cache Keys Structure

```typescript
// Hierarchical cache keys for efficient invalidation
export const itemsKeys = {
  all: ['items'],
  lists: () => [...itemsKeys.all, 'list'],
  list: (filters, pagination) => [...itemsKeys.lists(), { filters, pagination }],
  details: () => [...itemsKeys.all, 'detail'],
  detail: (id) => [...itemsKeys.details(), id],
  lowStock: () => [...itemsKeys.all, 'lowStock'],
};
```

## 🌐 Internationalization

### Adding Translations

```json
// src/locales/en/common.json
{
  "inventory": {
    "title": "Inventory Management",
    "fields": {
      "name": "Name",
      "sku": "SKU"
    }
  }
}
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  
  return <h1>{t('inventory.title')}</h1>;
}
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Usage Examples

### Creating a New Item

```typescript
import { useCreateItem } from 'features/inventory';

function CreateItemForm() {
  const createItem = useCreateItem();
  
  const handleSubmit = (data) => {
    createItem.mutate({
      name: data.name,
      sku: data.sku,
      sellingPrice: data.price,
      stockQuantity: data.quantity,
      // ... other fields
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Filtering and Pagination

```typescript
import { useItems } from 'features/inventory';

function ItemsList() {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    isActive: true
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const { data, isLoading } = useItems(filters, pagination);
  
  return (
    <div>
      {/* Search and filters */}
      {/* Items table */}
      {/* Pagination */}
    </div>
  );
}
```

## 🤝 Contributing

1. Follow the feature-based architecture
2. Use TypeScript for all new code
3. Add proper error handling
4. Include loading states
5. Add translations for new text
6. Write comprehensive types

## 📄 License

This project is licensed under the MIT License.
