import { useTranslation } from 'react-i18next';
import { Menu, Bell, Search } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Firm selector */}
          <div className="hidden sm:block">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Acme Corp</option>
              <option>Tech Solutions Ltd</option>
            </select>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 