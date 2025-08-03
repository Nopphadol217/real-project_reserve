import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Calendar, Users, Grid3X3, List } from 'lucide-react';
import { categories } from '../../utils/categories';

const SearchHeader = ({ 
  searchLocation, 
  setSearchLocation, 
  guests, 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode,
  filteredPlaces,
  selectedFilters,
  onFilterChange
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <span>หน้าแรก</span>
          <span className="mx-2">›</span>
          <span className="text-blue-200">ไทย</span>
          <span className="mx-2">›</span>
          <span>ค้นหาที่พัก</span>
          <span className="mx-2">›</span>
          <span>ผลการค้นหา</span>
        </nav>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ค้นหาชื่อที่พัก หรือ ที่อยู่"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Check-in / Check-out */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="วันเช็คอิน — วันเช็คเอาท์"
                className="pl-10 border-0 bg-gray-50 rounded-xl"
                readOnly
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder={guests}
                className="pl-10 border-0 bg-gray-50 rounded-xl"
                readOnly
              />
            </div>

            {/* Search Button */}
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              ค้นหา
            </Button>
          </div>

          {/* Category Quick Filter */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">ประเภทที่พักยอดนิยม:</h4>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedFilters.categories.includes(category.name);
                
                return (
                  <Button
                    key={category.name}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange('categories', category.name, !isSelected)}
                    className={`rounded-full px-4 py-2 text-xs transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
