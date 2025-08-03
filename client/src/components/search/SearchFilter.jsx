import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { categories } from '../../utils/categories';

const SearchFilter = ({ 
  selectedFilters, 
  onFilterChange, 
  filteredPlaces,
  getPlacePrice 
}) => {
  // คำนวณสถิติหมวดหมู่จากข้อมูลที่พัก
  const categoryStats = categories.map(category => {
    const count = filteredPlaces.filter(place => place.category === category.name).length;
    return {
      ...category,
      count
    };
  }).filter(category => category.count > 0); // แสดงเฉพาะหมวดหมู่ที่มีข้อมูล

  return (
    <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-6 text-gray-900 border-b pb-4">กรองผลการค้นหา</h3>
        
        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-gray-800 flex items-center">
            <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            ประเภทที่พัก
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={category.name}
                    checked={selectedFilters.categories.includes(category.name)}
                    onCheckedChange={(checked) => 
                      onFilterChange('categories', category.name, checked)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label htmlFor={category.name} className="text-sm cursor-pointer flex items-center gap-2 font-medium text-gray-700">
                    <category.icon className="w-4 h-4 text-blue-600" />
                    {category.label}
                  </label>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold mb-3 text-gray-800 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            ข้อมูลราคา
          </h4>
          <div className="space-y-2">
            <div className="text-sm text-gray-700 font-medium">
              ราคาเริ่มต้น: <span className="text-green-600 font-bold">฿{getPlacePrice(filteredPlaces[0] || {})}</span> บาท/คืน
            </div>
            <div className="text-sm text-gray-700">
              พบที่พักทั้งหมด: <span className="text-blue-600 font-semibold">{filteredPlaces.length}</span> แห่ง
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
