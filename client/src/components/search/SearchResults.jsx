import React from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Grid3X3, List } from 'lucide-react';
import PlaceCardSearch from './PlaceCardSearch';

const SearchResults = ({ 
  filteredPlaces,
  searchLocation,
  loading,
  error,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  setSearchLocation,
  setSelectedFilters
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดที่พัก...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        <Button onClick={() => window.location.reload()}>ลองใหม่</Button>
      </div>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">ไม่พบที่พักที่ตรงกับเงื่อนไขการค้นหา</p>
        <Button variant="outline" onClick={() => {
          setSearchLocation('');
          setSelectedFilters({ categories: [] });
        }}>
          ล้างตัวกรอง
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ที่พักในไทย: พบที่พัก {filteredPlaces.length} แห่ง
          </h1>
          {searchLocation && (
            <p className="text-gray-600 mt-1">
              ผลการค้นหาสำหรับ "{searchLocation}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-64 border-gray-200 rounded-xl">
              <SelectValue placeholder="จัดเรียงตาม: แนะนำ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">แนะนำ</SelectItem>
              <SelectItem value="price-low">ราคาต่ำสุด</SelectItem>
              <SelectItem value="price-high">ราคาสูงสุด</SelectItem>
              <SelectItem value="rating">คะแนนรีวิว</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-100'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-100'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {filteredPlaces.map((place) => (
          <PlaceCardSearch 
            key={place.id} 
            place={place} 
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>ก่อนหน้า</Button>
          <Button className="bg-blue-600 text-white">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <span className="px-2">...</span>
          <Button variant="outline">25</Button>
          <Button variant="outline">ถัดไป</Button>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
