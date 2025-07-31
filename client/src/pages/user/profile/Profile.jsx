import { profileAPI } from "@/api/profileAPI";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import ProfileContainer from "./ProfileContainer";
import ProfileButton from "./ProfileButton";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router";
import LogoutButton from "@/components/authentication/LogoutButton";
import ProfileEdit from "./ProfileEdit";

function Profile() {
  // zustand
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    myProfile();
  }, []);

  const myProfile = async () => {
    try {
      hydrate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-6 mx-auto max-w-6xl px-4">
      {/* Sidebar / Profile Menu */}
      <div className="lg:col-span-3">
        <ProfileContainer />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-7">
        <Card className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <ProfileEdit user={user} />

          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ออกจากระบบ
                </h3>
                <p className="text-gray-600">ออกจากบัญชีผู้ใช้ปัจจุบัน</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
export default Profile;
