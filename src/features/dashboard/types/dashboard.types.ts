export interface DashboardStats {
  totalRevenue: string;
  revenueChange: string;
  revenueChangeType: 'increase' | 'decrease';
  
  activeItems: string;
  itemsChange: string;
  itemsChangeType: 'increase' | 'decrease';
  
  totalClients: string;
  clientsChange: string;
  clientsChangeType: 'increase' | 'decrease';
  
  pendingInvoices: string;
  invoicesChange: string;
  invoicesChangeType: 'increase' | 'decrease';
}

export interface RecentActivity {
  id: number;
  type: 'invoice' | 'purchase' | 'item' | 'client';
  description: string;
  time: string;
  amount?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  variant: 'primary' | 'outline';
}

export interface DashboardFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  activityType?: string[];
} 