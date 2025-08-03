import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { categories } from '@/utils/categories';
import { usePlaceStore } from '@/store/usePlaceStore';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilter from '@/components/search/SearchFilter';
import SearchResults from '@/components/search/SearchResults';

const Search = () => {
  const navigate = useNavigate();
  const { places, loading, error, listPlaces } = usePlaceStore();
  
  const [searchLocation, setSearchLocation] = useState('');
  const [guests] = useState('ผู้ใหญ่ 3 • เด็ก 0 • 1 ห้อง');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedFilters, setSelectedFilters] = useState({
    categories: []
  });
  
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  // โหลดข้อมูลที่พักเมื่อ component mount
  useEffect(() => {
    listPlaces();
  }, [listPlaces]);

  // อัปเดต filteredPlaces เมื่อข้อมูลที่พักเปลี่ยน
  useEffect(() => {
    setFilteredPlaces(places || []);
  }, [places]);

  // กรองที่พักตามเงื่อนไขที่เลือก
  useEffect(() => {
    let filtered = [...(places || [])];

    // กรองตามหมวดหมู่
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(place => 
        selectedFilters.categories.includes(place.category)
      );
    }

    // กรองตามการค้นหาสถานที่
    if (searchLocation.trim()) {
      filtered = filtered.filter(place =>
        place.placeName?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        place.province?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // เรียงลำดับ
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => getPlacePriceNumber(a) - getPlacePriceNumber(b));
        break;
      case 'price-high':
        filtered.sort((a, b) => getPlacePriceNumber(b) - getPlacePriceNumber(a));
        break;
      case 'rating':
        // สำหรับตอนนี้ใช้ random rating
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // แนะนำ - คงลำดับเดิม
        break;
    }

    setFilteredPlaces(filtered);
  }, [places, selectedFilters, searchLocation, sortBy]);

  // ฟังก์ชันจัดการการเปลี่ยนตัวกรอง
  const handleFilterChange = (filterType, value, checked) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  // ฟังก์ชันคำนวณราคาจากห้องที่ถูกที่สุด
  const getPlacePrice = (place) => {
    // ตรวจสอบว่า place มีข้อมูลและ rooms เป็น array
    if (!place || !place.rooms || !Array.isArray(place.rooms) || place.rooms.length === 0) {
      return 'ติดต่อสอบถาม';
    }
    
    // หาราคาที่ต่ำที่สุดจากห้องทั้งหมด
    const prices = place.rooms
      .map(room => parseFloat(room.price) || 0)
      .filter(price => price > 0);
    
    if (prices.length === 0) {
      return 'ติดต่อสอบถาม';
    }
    
    const minPrice = Math.min(...prices);
    return minPrice.toLocaleString();
  };

  // ฟังก์ชันคำนวณราคาเป็นตัวเลขสำหรับการเรียงลำดับ
  const getPlacePriceNumber = (place) => {
    // ตรวจสอบว่า place มีข้อมูลและ rooms เป็น array
    if (!place || !place.rooms || !Array.isArray(place.rooms) || place.rooms.length === 0) {
      return 0;
    }
    
    // หาราคาที่ต่ำที่สุดจากห้องทั้งหมด
    const prices = place.rooms
      .map(room => parseFloat(room.price) || 0)
      .filter(price => price > 0);
    
    if (prices.length === 0) {
      return 0;
    }
    
    return Math.min(...prices);
  };

  // แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลที่พัก...</p>
        </div>
      </div>
    );
  }

  // แสดง error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => listPlaces()}>ลองใหม่</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Search Header */}
      <SearchHeader 
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        guests={guests}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredPlaces={filteredPlaces}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <SearchFilter 
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                filteredPlaces={filteredPlaces}
                getPlacePrice={getPlacePrice}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <SearchResults 
              filteredPlaces={filteredPlaces}
              searchLocation={searchLocation}
              loading={loading}
              error={error}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setSearchLocation={setSearchLocation}
              setSelectedFilters={setSelectedFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
