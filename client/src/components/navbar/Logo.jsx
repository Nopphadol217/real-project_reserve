import { Link } from "react-router";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuthStore";

function Logo() {
  const user = useAuthStore((state) => state.user);
  return (
    <Button asChild>
      {user?.role === "ADMIN" ? (
        <Link to="/admin">Admin</Link>
      ) : (
        <Link to="/">Logo</Link>
      )}
    </Button>
  );
}
export default Logo;
