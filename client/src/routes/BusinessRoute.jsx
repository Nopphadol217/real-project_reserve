import React, { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { Navigate } from "react-router";

const BusinessRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  useEffect(() => {
    hydrate();
  }, []);

  // Add loading state check
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "BUSINESS") {
    return <Navigate to="/" replace />;
  }

  // Check if business is approved (allow undefined status for now during development)
  if (user?.status && user?.status !== "approved") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">รอการอนุมัติ</h2>
          <p className="text-gray-600 mb-4">
            บัญชีผู้ประกอบการของคุณอยู่ในระหว่างการตรวจสอบ
          </p>
          <p className="text-sm text-gray-500">
            ทีมงานจะแจ้งผลการอนุมัติภายใน 2-3 วันทำการ
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default BusinessRoute;
