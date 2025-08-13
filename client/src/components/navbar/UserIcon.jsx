import { UserCircle } from "lucide-react"
import { Link } from "react-router"

function UserIcon() {
  return (
    <Link to='/auth'>
        <UserCircle/>
    </Link>
  )
}
export default UserIcon