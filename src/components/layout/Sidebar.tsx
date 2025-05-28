import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  ShoppingCart,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { NavItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    return item.children?.some(child => isActive(child.href)) || false;
  };

  React.useEffect(() => {
    // Create navigation with translations inside useEffect
    const navigation: NavItem[] = [
      {
        name: t('navigation.dashboard'),
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: t('navigation.inventory'),
        href: '/inventory',
        icon: Package,
        children: [
          { name: t('inventory.items'), href: '/inventory/items', icon: Package },
          { name: t('inventory.categories'), href: '/inventory/categories', icon: Package },
          { name: t('inventory.suppliers'), href: '/inventory/suppliers', icon: Users },
        ],
      },
      {
        name: t('navigation.sales'),
        href: '/sales',
        icon: FileText,
        children: [
          { name: t('sales.invoices'), href: '/sales/invoices', icon: FileText },
          { name: t('sales.clients'), href: '/sales/clients', icon: Users },
        ],
      },
      {
        name: t('navigation.purchasing'),
        href: '/purchasing',
        icon: ShoppingCart,
        children: [
          { name: t('purchasing.orders'), href: '/purchasing/orders', icon: ShoppingCart },
          { name: t('purchasing.suppliers'), href: '/purchasing/suppliers', icon: Users },
        ],
      },
      {
        name: t('navigation.company'),
        href: '/company',
        icon: Building2,
        children: [
          { name: t('company.settings'), href: '/company/settings', icon: Settings },
          { name: t('company.users'), href: '/company/users', icon: Users },
        ],
      },
    ];

    const checkActive = (href: string) => {
      return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    // Auto-expand parent items if child is active
    const checkParentActive = (item: NavItem) => {
      if (checkActive(item.href)) return true;
      return item.children?.some(child => checkActive(child.href)) || false;
    };

    navigation.forEach(item => {
      if (item.children && checkParentActive(item)) {
        setExpandedItems(prev => 
          prev.includes(item.name) ? prev : [...prev, item.name]
        );
      }
    });
  }, [location.pathname, t]);

  // Create navigation for render (same as above but outside useEffect)
  const navigation: NavItem[] = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('navigation.inventory'),
      href: '/inventory',
      icon: Package,
      children: [
        { name: t('inventory.items'), href: '/inventory/items', icon: Package },
        { name: t('inventory.categories'), href: '/inventory/categories', icon: Package },
        { name: t('inventory.suppliers'), href: '/inventory/suppliers', icon: Users },
      ],
    },
    {
      name: t('navigation.sales'),
      href: '/sales',
      icon: FileText,
      children: [
        { name: t('sales.invoices'), href: '/sales/invoices', icon: FileText },
        { name: t('sales.clients'), href: '/sales/clients', icon: Users },
      ],
    },
    {
      name: t('navigation.purchasing'),
      href: '/purchasing',
      icon: ShoppingCart,
      children: [
        { name: t('purchasing.orders'), href: '/purchasing/orders', icon: ShoppingCart },
        { name: t('purchasing.suppliers'), href: '/purchasing/suppliers', icon: Users },
      ],
    },
    {
      name: t('navigation.company'),
      href: '/company',
      icon: Building2,
      children: [
        { name: t('company.settings'), href: '/company/settings', icon: Settings },
        { name: t('company.users'), href: '/company/users', icon: Users },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {t('app.name')}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        'sidebar-link w-full justify-between',
                        isParentActive(item) && 'active'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={cn(
                              'sidebar-link text-sm',
                              isActive(child.href) && 'active'
                            )}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'sidebar-link',
                      isActive(item.href) && 'active'
                    )}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate">
                  john@example.com
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                to="/settings"
                className="sidebar-link text-sm"
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <Settings className="h-4 w-4" />
                <span>{t('navigation.settings')}</span>
              </Link>
              <button className="sidebar-link text-sm w-full text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>{t('navigation.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 