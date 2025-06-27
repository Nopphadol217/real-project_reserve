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
import { Separator } from "../ui/separator";

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
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "ADMIN"
            ? adminLinks.map((item, index) => {
                return (
                  <DropdownMenuItem key={index}>
                    <Link to={item.href}>
                      <div className="flex">
                        <span className="text-sm">{item.icon}</span>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-5"
                        />
                        {item.label}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })
            : privateLinks.map((item, index) => {
                return (
                  <DropdownMenuItem key={index}>
                    <Link to={item.href}>
                      <p>{item.label}</p>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export default DropdownListMenu;
