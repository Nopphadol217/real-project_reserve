import { BrowserRouter, Route, Routes } from "react-router";
import Login from "@/components/authentication/Login";
import Register from "@/components/authentication/Register";
import AuthContainer from "@/components/authentication/AuthContainer";
import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import Dashboard from "@/pages/admin/Dashboard";
import Manage from "@/pages/admin/ManageList";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import SearchPage from "@/pages/SearchPage_new";
import SearchPlaces from "@/pages/SearchPlaces";
import Profile from "@/pages/user/profile/Profile";
import AdminRoute from "./AdminRoute";
import UserManage from "@/pages/admin/UserManage";

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

        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="search-places" element={<SearchPlaces />} />
          <Route path="place/:id" element={<PlaceDetail />} />
        </Route>

        <Route path="user" element={<Layout />}>
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
