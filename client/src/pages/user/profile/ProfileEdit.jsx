import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function ProfileEdit({ user }) {
  return (
    <article>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            ข้อมูลส่วนตัว
          </h1>
          <p className="text-gray-600 mb-6">
            อัปเดตข้อมูลของท่าน และดูว่าจะมีการนำข้อมูลดังกล่าวไปใช้งานอย่างไร
          </p>
        </div>
        <div className="relative h-[70.8px]">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user?.picture}
              className="object-cover ]"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Badge className="absolute  bottom-0.5 hover:bg-emerald-400  -right-2 text-xs px-2 py-1 bg-emerald-500 border rounded shadow text-white">
            {" "}
            {user?.role}
          </Badge>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-x-4 gap-y-3">
        {/* Username */}
        <div className="text-gray-500 font-medium">Username</div>
        <div className="capitalize">{user?.username || "กำลังโหลด..."}</div>
        <div className="text-gray-500 font-medium flex justify-end">
          <button className="text-blue-500 hover:underline">แก้ไข</button>
        </div>

        {/* ชื่อ-นามสกุล */}
        <div className="text-gray-500 font-medium">ชื่อ-นามสกุล</div>
        <div className="capitalize">
          {user?.firstname} {user?.lastname}
        </div>
        <div className="text-gray-500 font-medium flex justify-end">
          <button className="text-blue-500 hover:underline">แก้ไข</button>
        </div>

        {/* Email */}
        <div className="text-gray-500 font-medium">อีเมล</div>
        <div>{user?.email || "กำลังโหลด..."}</div>
        <div className="text-gray-500 font-medium flex justify-end">
          <button className="text-blue-500 hover:underline">แก้ไข</button>
        </div>
      </div>
    </article>
  );
}
export default ProfileEdit;
