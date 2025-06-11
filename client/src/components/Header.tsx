
import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import GlobalSearch from './GlobalSearch';

interface HeaderProps {
  currentCity: string;
  onSearch: (cityName: string) => void;
  onLocationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentCity, onSearch, onLocationClick }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 safe-top">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 safe-left safe-right">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-3 md:hidden">
          {/* Logo and Location Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-bounce-in">
                <span className="text-white font-bold text-sm sm:text-lg">🌤️</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">WeatherNow</h1>
                <p className="text-xs sm:text-sm text-gray-600">By Dhinesh Kumar B</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 truncate max-w-20">{currentCity}</span>
            </div>
          </div>
          
          {/* Search and Location Button Row */}
          <div className="flex items-center space-x-2">
            <GlobalSearch 
              onSearch={onSearch}
              placeholder="Search city..."
              className="flex-1"
            />
            
            <button
              onClick={onLocationClick}
              className="touch-feedback flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px]"
              title="Use current location"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo and Current Location */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-bounce-in">
                <span className="text-white font-bold text-lg">🌤️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WeatherNow</h1>
                <p className="text-sm text-gray-600">By Dhinesh Kumar B</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{currentCity}</span>
            </div>
          </div>

          {/* Search Bar and Location Button */}
          <div className="flex items-center space-x-4 flex-1 max-w-md ml-8">
            <GlobalSearch 
              onSearch={onSearch}
              placeholder="Search for any city..."
              className="flex-1"
            />
            
            <button
              onClick={onLocationClick}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              title="Use current location"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Location</span>
            </button>
          </div>
        </div>
        
        {/* Mobile current location */}
        <div className="md:hidden mt-3 flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 w-fit">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">{currentCity}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
