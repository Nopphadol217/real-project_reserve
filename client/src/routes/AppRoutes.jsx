import { BrowserRouter, Route, Routes } from "react-router";
import Login from "@/components/authentication/Login";
import Register from "@/components/authentication/Register";
import AuthContainer from "@/components/authentication/AuthContainer";
import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import About from "@/pages/About";
import Dashboard from "@/pages/admin/Dashboard";
import Manage from "@/pages/admin/ManageList";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Service from "@/pages/Service";
import MyFavorite from "@/pages/user/MyFavorite";
import Profile from "@/pages/user/profile/Profile";
import AdminRoute from "./AdminRoute";
import UserManage from "@/pages/admin/UserManage";

import CreateListing from "@/pages/admin/EDITFORM/CreateListing";
import ManageList from "@/pages/admin/ManageList";
import EditForm from "@/pages/admin/EDITFORM/EditForm";
import PlaceDetail from "@/pages/user/PlaceDetail";

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
          <Route path="about" element={<About />} />
          <Route path="service" element={<Service />} />
          <Route path="contact" element={<Contact />} />
          <Route path="place/:id" element={<PlaceDetail />} />
        </Route>

        <Route path="user" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="myfavorite" element={<MyFavorite />} />
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
          <Route path="manage-user" element={<UserManage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
