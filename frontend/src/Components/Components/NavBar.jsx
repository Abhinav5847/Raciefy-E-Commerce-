  import { Link, useNavigate } from 'react-router-dom'
  import { User,HeartMinus,ShoppingCart } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { AppContext } from './AppProvider';


  export default function NavBar(){
  const navigate = useNavigate()


  const {isauth,logout,user,cart,wishlist} = useContext(AppContext)
  

  const handleLog =()=>{
    Swal.fire({
  title: "Are you sure you want to logout?",
  text: "You will need to log in again to continue.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes,Logout!"
}).then((result) => {
  if (result.isConfirmed) {
    logout()
     navigate("/",{ replace: true })
     Toast.fire({
    icon: "success",
    title: "Logged out successfully",
  });
  }
});
  
  }
      return(
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark shadow-lg sticky-top'>
            <div className='container'>
              <span className='navbar-brand fw-bold text-info'
               style={{cursor:"pointer"}}
               onClick={()=>navigate("/")}
              >RaceiFy</span>
              <button className='navbar-toggler'
              type="button"
                 data-bs-toggle="collapse"
                 data-bs-target="#navbarNav"
                 aria-controls="navbarNav"
                 aria-expanded="false"
                 aria-label="Toggle navigation"
              >
              <span className='navbar-toggler-icon'></span>
              </button>
            
            <div className="collapse navbar-collapse" id="navbarNav" style={{cursor:"pointer"}}>
               <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className='nav-item'>
                      <span className='nav-link' onClick={()=>navigate("/")}>Home</span>
                  </li>
                  <li className='nav-item'>
                      <span className='nav-link' onClick={()=>navigate("/About")}>About</span>
                  </li>
                  <li className='nav-item'>
                      <span className='nav-link' onClick={()=>navigate("/Products")}>Products</span>
                  </li>
               </ul>

                 <div className="d-flex align-items-center gap-4">

                     <div className="dropdown">

                      <button className='btn btn-outline-info dropdown-toggle d-flex align-items-center'
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      >
                      <User size={20} strokeWidth={0.75} className="me-1" />
                {isauth ? user?.name || "User" : "Guest"}

                      </button>

                      <ul className='dropdown-menu dropdown-menu-end' aria-labelledby='userDropdown'>
                          {!isauth ? (
                              <li><span className='dropdown-item' onClick={()=>navigate("/Login")}>Login</span></li>
                          ):(
                              <>
                              <li><span className='dropdown-item' onClick={()=>navigate("/Wishlist")}>Wishlist</span></li>
                              <li><span className='dropdown-item' onClick={()=>navigate("/Cart")}>Cart</span></li>
                              <li><span className='dropdown-item' onClick={()=>navigate("/Orders")}>Orders</span></li>
                              <li><span className='dropdown-item' onClick={handleLog}>Logout</span></li>
                              </>
                            )}
                      </ul>
                     </div>

                     {isauth && (
                      <>
                      <button className="btn btn-outline-danger" onClick={()=>navigate("/Wishlist")}><HeartMinus size={20} strokeWidth={0.75}
                      />{wishlist.length}</button>
                      <button className='btn btn-outline-info' onClick={()=>navigate("/Cart")}><ShoppingCart size={20} strokeWidth={0.75} />
                       {cart.length} </button>
                    
                      </>
                     )}
                 </div>

            </div>
               
            </div>
        </nav>
      )
  }