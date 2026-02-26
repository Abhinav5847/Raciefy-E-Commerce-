import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Loginpage from './Components/Pages/User Login/LoginPage'
import RegstrForm from './Components/Pages/User Regstr/RegstrForm'
import Home from './Components/Pages/Home Page/Home'
import About from './Components/Pages/About Page/About'
import Products from './Components/Pages/Products/Products'
import NavBar from './Components/Components/NavBar'
import Cart from './Components/Pages/Cart Page/Cart'
import WishList from './Components/Pages/Wishlist/WishList'
import Payment from './Components/Pages/Payment/Payment'
import Errorpage from './Components/Components/Errorpage'
import AppProvider from './Components/Components/AppProvider'
import LoginAd from './Admin/Loginadmin/LoginAd'
import HomeAd from './Admin/Home/HomeAd'
import ProductsAd from './Admin/ProductsAdmin/ProductsAd'
import UsersAd from './Admin/UsersAd'
import AddProduct from './Admin/ProductsAdmin/AddProduct'
import EditAd from './Admin/EditAd'
import OrdersAd from './Admin/OrdersAd'
import AdminUserDetail from './Admin/AdminUserView'
import AdminLayout from './adminlayout'
import ProtectedAdmin from './Admin/ProtectedAdmin'
import ProductView from './Components/Pages/ProductView/ProductView'
import Order from './Components/Pages/Orders/Order'
import LastPay from './Components/Pages/Payment/LastPay'
import VerifyEmail from './verifyEmail'
import "bootstrap/dist/js/bootstrap.bundle.min.js"


function AppContent(){

  const location = useLocation()

  // Hide navbar on login/register/admin pages
  const hideNav =
    location.pathname.startsWith('/admin') ||
    location.pathname === '/Login' ||
    location.pathname === '/Regstr' ||
    location.pathname === '/LoginAd'

  return(
    <>
      {!hideNav && <NavBar/>}

      <Routes>

        

        <Route path="/" element={<Home/>}/>
        <Route path="/Regstr" element={<RegstrForm/>} />
        <Route path="/Login" element={<Loginpage/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/Products" element={<Products/>} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/WishList" element={<WishList/>} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/ProductView/:id" element={<ProductView />} />
        <Route path="/Orders" element={<Order/>}/>
        <Route path="/LastPay" element={<LastPay />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />


        <Route path='/LoginAd' element={<LoginAd />} />

        

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >
          <Route index element={<HomeAd />} />
          <Route path="products" element={<ProductsAd />} />
          <Route path="users" element={<UsersAd />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit/:id" element={<EditAd />} />
          <Route path="orders" element={<OrdersAd />} />
          <Route path="user/:userId" element={<AdminUserDetail />} />
        </Route>


        <Route path="*" element={<Errorpage />} />

      </Routes>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  )
}

export default App