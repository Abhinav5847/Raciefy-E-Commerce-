import axios from "axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axios";

import { AppContext } from "../../Components/Components/AppProvider";
import adminAxios from "../../api/adminaxios";

export default function LoginAd(){

      const navigate = useNavigate()

      const {submitFrm} = useContext(AppContext)


    const [state,setState] = useState({
        email:"",
        password:""
    })

    const handleSubmit = (e) => {
    e.preventDefault();
    submitFrm(state.email, state.password, navigate);
  };


    // const submitFrm = async (e) =>{
    //     e.preventDefault();

    //     try{

    //       const res = await adminAxios.post('adminpanel/login/',{
    //         email:state.email,
    //         password:state.password,
    //       })

    //       localStorage.setItem("admin_access",res.data.access)
    //       localStorage.setItem("refresh",res.data.refresh)

    //       Swal.fire("Welcome!", "Admin login successful.", "success");

    //       navigate('/Admin')

    //     }
    //     catch(err){
    //       Swal.fire(
    //       "Login Failed",
    //       err.response?.data?.error || "Invalid credentials",
    //      "error"
    //      );
    //     }
    //   }
      


    //     const {email,password} = state;

    //     try{
    //       const res = await axios.get("http://localhost:5000/admin")
    //       const admin = res.data.find((i)=>i.email === email && i.password === password)
    //       if(admin){
    //         localStorage.setItem("adminID",admin.id)
    //         Swal.fire("Welcome!", "Admin login successful.", "success");
    //         navigate("/Admin")
    //       }else{
    //         Swal.fire("Invalid Credentials", "Try again.", "error")
    //       }
    //     }
    //     catch(err){
    //         console.log("error is:",err)
    //     }
    // }

    return(
   <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        gap:"1rem"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center",
          
        }}>
             <h1 style={{color:"black",marginBottom:"30px"}}>Admin Login</h1>
              <form onSubmit={handleSubmit} action="">
                <input type="email"
                 placeholder="Enter email" 
                 onChange={(e)=>setState({...state,email:e.target.value})}
                  style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
               border: "1px solid #ccc",
               outline: "none",
            }} 

                />
                <input type="password" 
                placeholder="Enter password"
                onChange={(e)=>setState({...state,password:e.target.value})}
              style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
             />
             <button type="submit"  style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.3s",
            }}>Login</button>

              </form>
        </div>


   </div>
    )
}