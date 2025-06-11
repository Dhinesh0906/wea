
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Clock, Calendar, Heart, Map } from 'lucide-react';

const Navigation: React.FC = () => {
  const [location] = useLocation();
  const currentPath = location;

  const tabs = [
    { id: 'current', label: 'Current', icon: Home, path: '/' },
    { id: 'hourly', label: 'Hourly', icon: Clock, path: '/hourly' },
    { id: 'daily', label: 'Daily', icon: Calendar, path: '/daily' },
    { id: 'favorites', label: 'Favorites', icon: Heart, path: '/favorites' },
    { id: 'map', label: 'Map', icon: Map, path: '/precipitation-map' },
  ];

  const getActiveTab = () => {
    const pathMap = {
      '/': 'current',
      '/hourly': 'hourly',
      '/daily': 'daily',
      '/favorites': 'favorites',
      '/precipitation-map': 'map'
    };
    return pathMap[currentPath as keyof typeof pathMap] || 'current';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-16 md:top-0 z-40 safe-left safe-right">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`touch-feedback flex flex-col sm:flex-row items-center justify-center sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 border-b-2 whitespace-nowrap transition-all duration-200 min-h-[50px] sm:min-h-[44px] min-w-[60px] sm:min-w-auto ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="font-medium text-xs sm:text-sm">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
