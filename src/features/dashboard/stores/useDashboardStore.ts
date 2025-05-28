import { create } from 'zustand';
import type { DashboardStats, RecentActivity, DashboardFilters } from '../types';

interface DashboardState {
  // Data
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  filters: DashboardFilters;
  
  // UI state
  isRefreshing: boolean;
  lastRefresh: Date | null;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  
  // Actions
  setStats: (stats: DashboardStats) => void;
  setRecentActivity: (activity: RecentActivity[]) => void;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  clearFilters: () => void;
  setIsRefreshing: (refreshing: boolean) => void;
  setLastRefresh: (date: Date) => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (interval: number) => void;
  refreshDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  stats: {
    totalRevenue: '$45,231.89',
    revenueChange: '+20.1%',
    revenueChangeType: 'increase',
    
    activeItems: '2,350',
    itemsChange: '+180',
    itemsChangeType: 'increase',
    
    totalClients: '12,234',
    clientsChange: '+19%',
    clientsChangeType: 'increase',
    
    pendingInvoices: '573',
    invoicesChange: '-2%',
    invoicesChangeType: 'decrease',
  },
  recentActivity: [
    {
      id: 1,
      type: 'invoice',
      description: 'Invoice #INV-001 created for Acme Corp',
      time: '2 hours ago',
      amount: '$1,250.00',
    },
    {
      id: 2,
      type: 'purchase',
      description: 'Purchase Order #PO-045 received',
      time: '4 hours ago',
      amount: '$850.00',
    },
    {
      id: 3,
      type: 'item',
      description: 'New item "Wireless Headphones" added',
      time: '6 hours ago',
    },
    {
      id: 4,
      type: 'client',
      description: 'New client "Tech Solutions Ltd" registered',
      time: '1 day ago',
    },
  ],
  filters: {},
  isRefreshing: false,
  lastRefresh: null,
  autoRefresh: true,
  refreshInterval: 300, // 5 minutes
  
  // Actions
  setStats: (stats) => set({ stats }),
  
  setRecentActivity: (activity) => set({ recentActivity: activity }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  clearFilters: () => set({ filters: {} }),
  
  setIsRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  
  setLastRefresh: (date) => set({ lastRefresh: date }),
  
  toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
  
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  
  refreshDashboard: async () => {
    const { setIsRefreshing, setLastRefresh } = get();
    setIsRefreshing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastRefresh(new Date());
    } finally {
      setIsRefreshing(false);
    }
  },
})); 