import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  MapPin,
  Home,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router";
import usePlaceStore from "@/store/usePlaceStore";
import useAuthStore from "@/store/useAuthStore";
import { deletePlace } from "@/api/createPlaceAPI";
import { toast } from "sonner";

const BusinessEditPlaces = () => {
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      await actionListPlace(user?.id);
      setLoading(false);
    };
    fetchPlaces();
  }, [actionListPlace, user?.id, places?.id]);

  // Filter places to show only those owned by current user
  const userPlaces = places.filter((place) => place.userId === user?.id);
  const handleDelete = async (placeId) => {
    // Handle delete action
    try {
      await deletePlace(placeId);
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารถลบได้กรุณาแก้สถานะการจ้องให้ว่าง");
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount || 0);
  };

  const getStatusBadge = (isActive) => {
    return isActive !== false ? (
      <Badge className="bg-green-100 text-green-800">เปิดใช้งาน</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">ปิดใช้งาน</Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลที่พัก...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              จัดการที่พักของคุณ
            </h1>
            <p className="text-gray-600">
              แก้ไข อัปเดต และจัดการที่พักทั้งหมดของคุณ
            </p>
          </div>
          <Link to="/business/create-listing">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มที่พักใหม่
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    ที่พักทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userPlaces.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    เปิดใช้งาน
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      userPlaces.filter((place) => place.isActive !== false)
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    ราคาเฉลี่ย
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userPlaces.length > 0
                      ? formatCurrency(
                          userPlaces.reduce(
                            (sum, place) => sum + (place.price || 0),
                            0
                          ) / userPlaces.length
                        )
                      : formatCurrency(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Places Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการที่พักของคุณ</CardTitle>
          </CardHeader>
          <CardContent>
            {userPlaces.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ที่พัก</TableHead>
                    <TableHead>ที่อยู่</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>คะแนน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPlaces.map((place) => (
                    <TableRow key={place.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                            {place.images && place.images[0] ? (
                              <img
                                src={place.images[0]}
                                alt={place.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{place.title}</p>
                            <p className="text-sm text-gray-500">
                              {place.category} • {place.rooms} ห้อง
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm">
                            {place.district}, {place.province}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">
                          {formatCurrency(place.price)}
                        </span>
                        <span className="text-sm text-gray-500">/คืน</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{place.rating || "ยังไม่มี"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(place.isActive)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/place/${place.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/business/edit-place/${place.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/business/payment-settings/${place.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(place.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ยังไม่มีที่พัก
                </h3>
                <p className="text-gray-500 mb-6">
                  เริ่มต้นสร้างรายได้โดยการเพิ่มที่พักแรกของคุณ
                </p>
                <Link to="/business/create-listing">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    สร้างที่พักแรก
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessEditPlaces;
