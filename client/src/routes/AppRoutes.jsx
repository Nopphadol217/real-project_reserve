import { BrowserRouter, Route, Routes } from "react-router";
import Login from "@/components/authentication/Login";
import Register from "@/components/authentication/Register";
import AuthContainer from "@/components/authentication/AuthContainer";
import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import LayoutBusiness from "@/layouts/LayoutBusiness";
import Dashboard from "@/pages/admin/Dashboard";
import Manage from "@/pages/admin/ManageList";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

import SearchPlaces from "@/pages/SearchPlaces";
import Profile from "@/pages/user/profile/Profile";
import AdminRoute from "./AdminRoute";
import BusinessRoute from "./BusinessRoute";
import UserManage from "@/pages/admin/UserManage";
import BusinessRegister from "@/pages/BusinessRegister";
import BusinessDashboard from "@/pages/business/BusinessDashboard";
import BusinessBookings from "@/pages/business/BusinessBookings";
import BusinessBookingManagement from "@/pages/business/BusinessBookingManagement";
import BusinessCreateListing from "@/pages/business/BusinessCreateListing";
import BusinessPaymentManagement from "@/pages/business/BusinessPaymentManagement";
import BusinessEditPlaces from "@/pages/business/BusinessEditPlaces";

import CreateListing from "@/pages/admin/EDITFORM/CreateListing";
import ManageList from "@/pages/admin/ManageList";
import EditForm from "@/pages/admin/EDITFORM/EditForm";
import EditPaymentInfo from "@/pages/admin/EDITFORM/EditPaymentInfo";
import PlaceDetail from "@/pages/user/PlaceDetail";
import Checkout from "@/pages/user/Checkout";
import Complete from "@/pages/user/Complete";

import MyBookings from "@/pages/user/MyBookings";
import PaymentManagement from "@/pages/admin/PaymentManagement";
import BookingManagement from "@/pages/admin/BookingManagement";
import Analytics from "@/pages/admin/Analytics";
import MyOrders from "@/pages/user/MyOrders";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication with animation */}
        <Route path="auth" element={<AuthContainer />} />

        {/* Separate authentication routes (keep for backward compatibility) */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="business-register" element={<BusinessRegister />} />

        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="search-places" element={<SearchPlaces />} />
          <Route path="place/:id" element={<PlaceDetail />} />
        </Route>

        <Route path="user" element={<Layout />}>
          ```
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="checkout/:id" element={<Checkout />} />
          <Route path="complete/:session_id" element={<Complete />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <LayoutAdmin />
            </AdminRoute>
          }
        >
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="manage" element={<Manage />} />
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="manage-list" element={<ManageList />} />
          <Route path="manage-list/:id" element={<EditForm />} />
          <Route path="payment-info/:id" element={<EditPaymentInfo />} />
          <Route path="manage-user" element={<UserManage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
        </Route>

        {/* Business Routes */}
        <Route
          path="business"
          element={
            <BusinessRoute>
              <LayoutBusiness />
            </BusinessRoute>
          }
        >
          <Route index element={<BusinessDashboard />} />
          <Route path="dashboard" element={<BusinessDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<BusinessBookings />} />
          <Route path="create-listing" element={<BusinessCreateListing />} />
          <Route path="payments" element={<BusinessPaymentManagement />} />
          <Route path="edit-places" element={<BusinessEditPlaces />} />
          <Route path="edit-place/:id" element={<EditForm />} />
          <Route path="analytics" element={<BusinessDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
