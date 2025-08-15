import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, DollarSign, Filter, Users, Bed } from "lucide-react";
import SearchMap from "@/components/map/SearchMap";
import usePlaceStore from "@/store/usePlaceStore";
import useAuthStore from "@/store/useAuthStore";
import { categories } from "@/utils/categories";

/**
 * ✅ สิ่งที่ปรับตามคำขอ
 * - โยก Filter ไปเป็น Sidebar (ซ้าย) แบบ Booking.com
 * - Map ย้ายเข้า Dialog (shadcn/ui)
 * - ไม่แตะโครงสร้างข้อมูลและฟังก์ชันเดิม (ใช้ places จาก store เดิมทั้งหมด)
 * - เพิ่ม Skeleton ทั้งฝั่ง Sidebar และ Content ตอนกำลังโหลด
 */

export default function SearchPlaces() {
  const places = usePlaceStore((s) => s.places);
  const actionListPlace = usePlaceStore((s) => s.actionListPlace);
  const user = useAuthStore((s) => s.user);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.7563, 100.5018]); // Bangkok
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    guests: 1,
    category: "all",
    minPrice: "",
    maxPrice: "",
  });

  // โหลดข้อมูลตามเดิม (ไม่แตะโครงสร้าง)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        await actionListPlace(user?.id);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [actionListPlace, user?.id]);

  // กรองรายการตามฟิลเตอร์ (ไม่แตะ obj ภายใน place)
  const filteredPlaces = useMemo(() => {
    if (!Array.isArray(places)) return [];
    let filtered = [...places];

    // search term
    if (searchFilters.searchTerm.trim()) {
      const term = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        [p.title, p.description, p.address]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term))
      );
    }

    // category
    if (searchFilters.category && searchFilters.category !== "all") {
      const cat = categories.find((c) => c.value === searchFilters.category);
      if (cat) {
        filtered = filtered.filter((p) => {
          const pc = (p.category || "").toLowerCase();
          return pc === cat.value.toLowerCase() || pc === cat.label.toLowerCase();
        });
      }
    }

    // price
    if (searchFilters.minPrice) {
      filtered = filtered.filter((p) => (p.price || 0) >= parseInt(searchFilters.minPrice));
    }
    if (searchFilters.maxPrice) {
      filtered = filtered.filter((p) => (p.price || 0) <= parseInt(searchFilters.maxPrice));
    }

    // guests (ใช้ rooms เป็นความจุ)
    if (searchFilters.guests > 1) {
      filtered = filtered.filter((p) => (p.rooms || 0) >= searchFilters.guests);
    }

    // อัปเดต center ให้ใกล้รายการแรกที่เจอ
    if (filtered.length > 0 && filtered[0].lat && filtered[0].lng) {
      setMapCenter([filtered[0].lat, filtered[0].lng]);
    }

    return filtered;
  }, [places, searchFilters]);

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({ searchTerm: "", guests: 1, category: "all", minPrice: "", maxPrice: "" });
    setSelectedPlace(null);
  };

  const handleMarkerClick = (place) => setSelectedPlace(place);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ค้นหาที่พัก</h1>
            <p className="text-sm text-gray-600 mt-1">
              พบ {filteredPlaces.length} ที่พักจากทั้งหมด {places?.length || 0} ที่พัก
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsMapOpen(true)} className="hidden sm:flex gap-2">
              <MapPin className="w-4 h-4" /> เปิดแผนที่
            </Button>
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <Filter className="w-4 h-4" /> ล้างตัวกรอง
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Layout: Sidebar (left) + Results (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <Card className="sticky top-4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" /> กรองการค้นหา
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <SidebarSkeleton />
                ) : (
                  <ScrollArea className="h-[70vh] pr-2">
                    {/* คำค้นหา */}
                    <div className="space-y-2 mb-5">
                      <Label htmlFor="searchTerm">คำค้นหา</Label>
                      <Input
                        id="searchTerm"
                        placeholder="ชื่อที่พัก รายละเอียด หรือที่อยู่"
                        value={searchFilters.searchTerm}
                        onChange={(e) => handleSearchChange("searchTerm", e.target.value)}
                      />
                    </div>

                    {/* หมวดหมู่ */}
                    <div className="space-y-2 mb-5">
                      <Label htmlFor="category">ประเภทที่พัก</Label>
                      <Select value={searchFilters.category} onValueChange={(v) => handleSearchChange("category", v)}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกประเภท</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* quick chips */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <QuickChip
                          active={searchFilters.category === "all"}
                          onClick={() => handleSearchChange("category", "all")}
                          label="ทุกประเภท"
                        />
                        {categories.map((c) => (
                          <QuickChip
                            key={c.value}
                            active={searchFilters.category === c.value}
                            onClick={() => handleSearchChange("category", c.value)}
                            label={c.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* ราคา */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="space-y-2">
                        <Label htmlFor="minPrice">ราคาต่ำสุด</Label>
                        <Input
                          id="minPrice"
                          type="number"
                          placeholder="0"
                          value={searchFilters.minPrice}
                          onChange={(e) => handleSearchChange("minPrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxPrice">ราคาสูงสุด</Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          placeholder="ไม่จำกัด"
                          value={searchFilters.maxPrice}
                          onChange={(e) => handleSearchChange("maxPrice", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* ผู้เข้าพัก */}
                    <div className="space-y-2 mb-6">
                      <Label htmlFor="guests">จำนวนผู้เข้าพัก</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleSearchChange("guests", Math.max(1, searchFilters.guests - 1))}
                        >
                          -
                        </Button>
                        <Input
                          id="guests"
                          type="number"
                          className="w-20 text-center"
                          value={searchFilters.guests}
                          onChange={(e) => handleSearchChange("guests", Math.max(1, Number(e.target.value || 1)))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleSearchChange("guests", searchFilters.guests + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full mb-2">
                      <Search className="w-4 h-4 mr-2" /> ค้นหา ({filteredPlaces.length} ผลลัพธ์)
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={clearFilters}>
                      รีเซ็ตตัวกรอง
                    </Button>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <section className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : filteredPlaces.length === 0
                ? (
                    <Card className="col-span-full">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Search className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบที่พักที่ตรงกับการค้นหา</h3>
                        <p className="text-gray-600 text-center">ลองเปลี่ยนเงื่อนไขการค้นหาหรือล้างตัวกรอง</p>
                      </CardContent>
                    </Card>
                  )
                : (
                    filteredPlaces.map((place) => (
                      <Card
                        key={place.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPlace?.id === place.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedPlace(place)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-3">
                            {place.secure_url && (
                              <img
                                src={place.secure_url}
                                alt={place.title}
                                className="w-full h-44 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-base text-gray-900 line-clamp-2">{place.title}</h3>
                                <Badge variant="secondary" className="text-xs">{place.category}</Badge>
                              </div>

                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{place.description}</p>

                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-1"><Bed className="w-3 h-3" /><span>{place.rooms} ห้อง</span></div>
                                <div className="flex items-center gap-1"><Users className="w-3 h-3" /><span>สูงสุด {Math.max(1, (place.rooms || 0) * 2)} คน</span></div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span className="font-bold text-lg">฿{(place.price || 0).toLocaleString()}</span>
                                  <span className="text-xs text-gray-500">/คืน</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.open(`/place/${place.id}`, "_blank"); }}>ดูรายละเอียด</Button>
                                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setIsMapOpen(true); setSelectedPlace(place); }}>ดูแผนที่</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
            </div>
          </section>
        </div>
      </div>

      {/* Map Dialog (shadcn) */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-5xl w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> แผนที่
              {selectedPlace && (
                <Badge variant="default" className="ml-2 max-w-40 truncate">{selectedPlace.title}</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[650px] w-full">
            <SearchMap
              places={filteredPlaces}
              center={mapCenter}
              zoom={7}
              selectedPlace={selectedPlace}
              onMarkerClick={handleMarkerClick}
              height="100%"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- Small UI helpers ---------- //
function QuickChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 border rounded-lg text-left text-xs transition-colors ${
        active ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
