import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import adminAxios from "../../api/adminaxios";


export const AppContext = createContext();


const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [product, setProduct] = useState([]);
  const [isauth, setisauth] = useState(!!localStorage.getItem("access"));
  const [admin,setadmin] = useState(!!localStorage.getItem("admin_access"))
  const [home, sethome] = useState([]);
  
  

  const fetchWishlist = async () => {
    try{
      const res = await axiosInstance.get('/wishlist/')
      setWishlist(res.data)
    }
    catch(err){
      console.log("err",err)
    }
  }

  const productFetching = async () => {
    try {
      const res = await axiosInstance.get("/product/products/");
      sethome(res.data);
       console.log("PRODUCT FETCH CALLED");
    } catch (err) {
      console.log("product fetching issue");
    }
  };

  useEffect(() => {
    productFetching();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/user/");
      setUser(res.data);
    } catch (err) {
      console.log("Error fetching user:", err);
      logout();
    }
  };

  const fetchcart = async () => {
    try {
      const res = await axiosInstance.get("/cart/");
      setCart(res.data);
    } catch (err) {
      console.log("error fetching cart", err);
    }
  };

  const login = async (access, refresh) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setisauth(true);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    await fetchCurrentUser();
    await fetchcart();
    await fetchWishlist()
    await productFetching()

    Toast.fire({
      icon: "success",
      title: "Login Successful!",
    });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setisauth(false);
    setUser(null);
    setCart([]);
    setWishlist([]);
    Toast.fire({
      icon: "success",
      title: "Logged Out!",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    setisauth(true);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchCurrentUser();
    fetchcart();
    fetchWishlist();
  }, []);

  const addCart = async (item) => {
    if (!isauth) {
      return Toast.fire({
        icon: "warning",
        title: "Login Required",
      });
    }

    try {
      await axiosInstance.post("/cart/", {
        product: item.id,
        quantity: 1,
      });

      await fetchcart();

      Toast.fire({
        icon: "success",
        title: "Product added to cart",
      });
    } catch (err) {
      console.log("error adding to cart", err);
    }
  };

  const removeCartitem = async (id) => {
    try {
      await axiosInstance.delete(`/cart/cart_delete/${id}/`);
      await fetchcart();
      Toast.fire({
        icon: "success",
        title: "Item removed from cart",
      });
    } catch (err) {
      console.log("removing cart issue", err);
    }
  };

  const updateCartitem = async (id, quantity) => {
  try {
    await axiosInstance.patch(`/cart/cart_delete/${id}/`, { quantity });
    fetchcart();
  } catch (err) {
    console.log("update cart err", err);
  }
};  

const toggleWishlist = async (item) => {
  if (!isauth) {
    return Toast.fire({
      icon: "warning",
      title: "Login Required",
    });
  }

  try {
    const res = await axiosInstance.post("/wishlist/", {
      product_id: item.id,
    });

  
    await fetchWishlist();

    Toast.fire({
      icon: "success",
      title: res.data.message,
    });

  } catch (err) {
    console.log("Error updating wishlist:", err);
    Toast.fire({
      icon: "error",
      title: "Something went wrong!",
    });
  }
};

//adminside

const [users,setusers] = useState([])
const [orders,setorders] = useState([])
const [adminproducts,setadminproducts] = useState([])

const adminFetchusers = async () => {
  const res = await adminAxios.get('adminpanel/total_users/')
  setusers(res.data)
}

useEffect(()=>{
  if(!admin) return 

adminFetchusers()
adminFetchorders()
AdminProductFetching()
},[admin])

const adminFetchorders = async () => {
  try{
    const res = await adminAxios.get('adminpanel/total_orders/')
    setorders(
      res.data
    )
  }
  catch(err){
    console.log("admin orders fetching issue",err)
  }
}

const productEdit = async (id) => {
  try{
    await adminAxios.patch(`adminpanel/product/${id}`)
  }
  catch (err){
    console.log("product editing issue",err)
  }
}

 const productDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This product will be moved to recycle bin.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await adminAxios.patch(`adminpanel/product_delete/${id}/`);

    await AdminProductFetching(); 

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Product deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

  } catch (err) {
    console.log("product delete issue", err);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
};

const submitFrm = async (email,password,navigate) =>{
    
        try{

          const res = await adminAxios.post('adminpanel/login/',{
            email,
            password,
          })

          localStorage.setItem("admin_access",res.data.access)
          localStorage.setItem("admin_refresh",res.data.refresh)

          setadmin(true)
          // await adminFetchusers()
          // await adminFetchorders()
          // await AdminProductFetching()

          Swal.fire("Welcome!", "Admin login successful.", "success");
          
          navigate('/admin')

        }
        catch(err){
          Swal.fire(
          "Login Failed",
          err.response?.data?.error || "Invalid credentials",
         "error"
         );
        }
      }

  const AdminProductFetching = async () => {
    try{
      const res = await adminAxios.get('adminpanel/product_list/')
      setadminproducts(res.data)
    }
    catch (err){
      console.log("admin product fetching ui fetching issue")
    }
  }   



  return (
    <AppContext.Provider
      value={{
        user,
        submitFrm,
        users,
        isauth,
        login,
        logout,
        cart,
        setCart,
        fetchcart,
        addCart,
        wishlist,
        toggleWishlist,
        product,
        setProduct,
        removeCartitem,
        updateCartitem,
        home,
        fetchWishlist,
        orders,
        setorders,
        adminFetchusers,
        adminproducts,
        productDelete ,
        AdminProductFetching,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
