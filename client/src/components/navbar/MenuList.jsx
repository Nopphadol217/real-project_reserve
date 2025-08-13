import { publicLinks } from "@/utils/links";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { AlignLeft, ChevronDown, Menu, X } from "lucide-react";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
import UserIcon from "./UserIcon";
import useAuthStore from "@/store/useAuthStore";
import ProfileButton from "@/pages/user/profile/ProfileButton";
import DropdownListMenu from "./DropdownListMenu";

import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ButtonMUI from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { cn } from "@/lib/utils";

function MenuList({ isMobileOnlyToggle }) {
  const [state, setState] = useState({
    right: false,
  });
  const location = useLocation();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState((prev) => ({ ...prev, [anchor]: open }));
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {publicLinks.map((item, index) => (
          <ListItem key={item.label} disablePadding>
            <Link to={item.href}>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // ปิด drawer ถ้าขยายหน้าจอเป็น lg ขึ้นไป
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      if (mediaQuery.matches) {
        setState((prev) => ({ ...prev, right: false }));
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <>
      {isMobileOnlyToggle && (
        <button
          onClick={() => setState((prev) => ({ ...prev, right: !prev.right }))}
          className="relative p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          aria-label="Toggle navigation"
        >
          <div className="relative w-6 h-6">
            <Menu
              className={`absolute inset-0 text-white transition-all duration-300 ${
                state.right
                  ? "opacity-0 rotate-90 scale-75 pointer-events-none"
                  : "opacity-100 rotate-0 scale-100 pointer-events-auto"
              }`}
            />
            <X
              className={`absolute inset-0 text-red-500 transition-all duration-300 ${
                state.right
                  ? "opacity-100 rotate-0 scale-100 pointer-events-auto"
                  : "opacity-0 rotate-90 scale-0 pointer-events-none"
              }`}
            />
          </div>
        </button>
      )}

      {/* Drawer Sidebar เฉพาะด้านขวา */}
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {list("right")}
      </SwipeableDrawer>

      {!isMobileOnlyToggle && (
        <ul className="flex justify-center items-center space-x-6">
          {publicLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative bg-transparent text-white hover:bg-white/10 transition-all duration-300",
                      isActive &&
                        "border-white/50 ring-2 ring-white/60 text-white "
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default MenuList;
