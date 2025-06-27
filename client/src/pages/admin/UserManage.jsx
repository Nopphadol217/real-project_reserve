// components/user-manage/user-manage.jsx
import { DataTable } from "@/pages/admin/Tablelist/data-table";
import { ColumnDef } from "@/pages/admin/Tablelist/column";
import usePlaceStore from "@/store/usePlaceStore";
import useUserStore from "@/store/useUserStore";
import { useEffect } from "react";

const UserManage = () => {
  const actionListUser = useUserStore((state) => state.actionReadUser);
  const user = useUserStore((state) => state.users);
  console.log(user);
  useEffect(() => {
    actionListUser();
  }, []);

  const mockData = user.map((item) => ({
    id: item.id,
    email: item.email,
    firstname: item.firstname,
    lastname: item.lastname,
    role:item.role
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      <DataTable columns={ColumnDef} data={mockData} />
    </div>
  );
};
export default UserManage;
