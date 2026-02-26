import { Navigate } from "react-router-dom"


export default function ProtectedAdmin({children}){
    
    const adminId = localStorage.getItem("admin_access")

    if(!adminId){
       return <Navigate to="/LoginAd" replace/>
    }

   return children;
}