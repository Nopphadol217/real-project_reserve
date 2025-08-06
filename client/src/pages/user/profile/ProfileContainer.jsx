import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingBag, User } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

function ProfileContainer() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      {/* Profile Info */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardHeader>
      </Card>

      {/* Management Menu */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            เมนูการจัดการ
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          {/* Booking Item */}
          <Link
            to="/user/mybookings"
            className="flex items-center space-x-3 py-4 px-2 hover:bg-muted rounded-md transition-all"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-foreground">
              การจองของฉัน
            </span>
          </Link>

          {/* Separator */}
          <Separator />

          {/* Order Item */}
          <Link
            to="/user/my-orders"
            className="flex items-center space-x-3 py-4 px-2 hover:bg-muted rounded-md transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-foreground">
              คำสั่งซื้อของฉัน
            </span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileContainer;
