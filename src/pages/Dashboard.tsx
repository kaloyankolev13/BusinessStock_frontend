import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  FileText,
  DollarSign,
} from 'lucide-react';

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'increase',
    icon: DollarSign,
  },
  {
    name: 'Active Items',
    value: '2,350',
    change: '+180',
    changeType: 'increase',
    icon: Package,
  },
  {
    name: 'Total Clients',
    value: '12,234',
    change: '+19%',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Pending Invoices',
    value: '573',
    change: '-2%',
    changeType: 'decrease',
    icon: FileText,
  },
];

const recentActivity = [
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
    amount: null,
  },
  {
    id: 4,
    type: 'client',
    description: 'New client "Tech Solutions Ltd" registered',
    time: '1 day ago',
    amount: null,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
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
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-primary">
                <FileText className="h-4 w-4 mr-2" />
                New Invoice
              </button>
              <button className="btn-outline">
                <Package className="h-4 w-4 mr-2" />
                Add Item
              </button>
              <button className="btn-outline">
                <Users className="h-4 w-4 mr-2" />
                New Client
              </button>
              <button className="btn-outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Purchase Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 