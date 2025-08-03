import ProfileButton from "@/pages/user/profile/ProfileButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { adminLinks, privateLinks } from "@/utils/links";
import { Link } from "react-router";
import LogoutButton from "../authentication/LogoutButton";
import useAuthStore from "@/store/useAuthStore";

function DropdownListMenu() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <ProfileButton />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>เมนูของฉัน</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* User Links - การจองและรายการโปรด */}
          {user.role === "ADMIN"
            ? adminLinks.map((item, index) => {
                return (
                  <DropdownMenuItem key={index} asChild>
                    <Link
                      to={item.href}
                      className="flex items-center cursor-pointer"
                    >
                      <span className="text-sm mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })
            : privateLinks.map((item, index) => {
                return (
                  <DropdownMenuItem key={index} asChild>
                    <Link
                      to={item.href}
                      className="flex items-center cursor-pointer"
                    >
                      <span className="text-sm mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export default DropdownListMenu;
