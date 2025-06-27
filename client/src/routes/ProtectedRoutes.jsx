import useAuthStore from "@/store/useAuthStore"
import { Navigate, useNavigate } from "react-router"

function ProtectedRoutes() {
  const navigate = useNavigate()
  const user  = useAuthStore((state)=>state.user)
  if(user){
    return <Navigate to="/profile"/>
  }
  return (
    <div>ProtectedRoutes</div>
  )
}
export default ProtectedRoutes