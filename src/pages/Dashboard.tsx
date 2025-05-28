import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  FileText,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import { useDashboardStore } from '../features/dashboard';

export default function Dashboard() {
  const { t } = useTranslation();
  const {
    stats,
    recentActivity,
    isRefreshing,
    lastRefresh,
    refreshDashboard,
  } = useDashboardStore();

  const statsData = [
    {
      name: t('dashboard.totalRevenue'),
      value: stats.totalRevenue,
      change: stats.revenueChange,
      changeType: stats.revenueChangeType,
      icon: DollarSign,
    },
    {
      name: t('dashboard.activeItems'),
      value: stats.activeItems,
      change: stats.itemsChange,
      changeType: stats.itemsChangeType,
      icon: Package,
    },
    {
      name: t('dashboard.totalClients'),
      value: stats.totalClients,
      change: stats.clientsChange,
      changeType: stats.clientsChangeType,
      icon: Users,
    },
    {
      name: t('dashboard.pendingInvoices'),
      value: stats.pendingInvoices,
      change: stats.invoicesChange,
      changeType: stats.invoicesChangeType,
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('navigation.dashboard')}</h1>
          <p className="text-gray-600">
            {t('dashboard.welcome')}
          </p>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={refreshDashboard}
          disabled={isRefreshing}
          className="btn btn-outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <TrendingDown className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.recentActivity')}</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {activity.type === 'invoice' && (
                        <FileText className="h-4 w-4 text-primary-600" />
                      )}
                      {activity.type === 'purchase' && (
                        <Package className="h-4 w-4 text-primary-600" />
                      )}
                      {activity.type === 'item' && (
                        <Package className="h-4 w-4 text-primary-600" />
                      )}
                      {activity.type === 'client' && (
                        <Users className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-gray-900">
                          {activity.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.quickActions')}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-primary">
                <FileText className="h-4 w-4 mr-2" />
                {t('dashboard.newInvoice')}
              </button>
              <button className="btn-outline">
                <Package className="h-4 w-4 mr-2" />
                {t('dashboard.addItem')}
              </button>
              <button className="btn-outline">
                <Users className="h-4 w-4 mr-2" />
                {t('dashboard.newClient')}
              </button>
              <button className="btn-outline">
                <DollarSign className="h-4 w-4 mr-2" />
                {t('dashboard.purchaseOrder')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 