import { UserCircle } from "lucide-react"
import { Link } from "react-router"

function UserIcon() {
  return (
    <Link to='/login'>
        <UserCircle/>
    </Link>
  )
}
export default UserIcon