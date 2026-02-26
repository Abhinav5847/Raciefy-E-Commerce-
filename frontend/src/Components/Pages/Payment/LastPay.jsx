import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "../../Components/AppProvider";
import axiosInstance from "../../../api/axios";

export default function LastPay() {
  const location = useLocation();
  const navigate = useNavigate();
 
  const { cart } = location.state || { cart: []};
  const total = cart.reduce((sum, item) => {
  const price = Number(item.product_price) || 0;
  const quantity = Number(item.quantity) || 1;
  return sum + price * quantity;
  }, 0);

  const { isauth,fetchcart } = useContext(AppContext);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  console.log("CART DATA:", cart);

  const [paymentMethod, setPaymentMethod] = useState("");

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode ||
      !paymentMethod
    ) {
      Swal.fire("Please fill in all fields before payment.");
      return;
    }

    if (!isauth) {
      Swal.fire("Error", "User not logged in.", "error");
      return;
    }

    try {
       const token = localStorage.getItem("access")

       const totalAmountInPaise = total; 
if (totalAmountInPaise <= 0) {
  Swal.fire("Error", "Cart total is zero. Cannot proceed with payment.", "error");
  return;
}

       const { data } = await axiosInstance.post(
        "payment/create_order/",
        { amount:totalAmountInPaise},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
       );

       const options = {
        key:"rzp_test_SGrCwBW6n5OYwJ",
        amount:data.amount,
        currency: "INR",
        name: "Your Shop Name",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          await axiosInstance.post('/orders/order/',
            {
              address,
              paymentMethod: paymentMethod,
              razorpay_payment_id: response.razorpay_payment_id
            },
            {
              headers:{
                Authorization: `Bearer ${token}`,
              },
            }
          );

          fetchcart()

          Swal.fire({
          title: "Payment Successful!",
          icon: "success",
        }).then(() => {
          navigate("/Orders");
        });
      },
      prefill: {
        name: address.name,
        contact: address.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
     console.log("ERROR STATUS:", error.response?.status);
  console.log("ERROR DATA:", error.response?.data);
  Swal.fire("Error", JSON.stringify(error.response?.data), "error");
  }
  console.log("TOTAL VALUE:", total);
};


  return (
    <div className="container-fluid py-5 bg-dark text-light min-vh-100 overflow-hidden">
      <h1 className="text-center mb-5 text-info">Payment Summary</h1>

      {cart.length > 0 ? (
        <>
          <div className="container bg-secondary p-4 rounded shadow-lg mb-5">
            <h3 className="text-light mb-4">Delivery Address</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="form-control"
                  value={address.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="form-control"
                  value={address.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  className="form-control"
                  value={address.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="form-control"
                  value={address.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  className="form-control"
                  value={address.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="container bg-secondary p-4 rounded shadow-lg mb-5">
            <h3 className="text-light mb-4">Payment Method</h3>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="payment"
                id="upi"
                value="UPI"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="upi" className="form-check-label">
                UPI (Google Pay / PhonePe)
              </label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="payment"
                id="card"
                value="Card"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="card" className="form-check-label">
                Credit / Debit Card
              </label>
            </div>

            {/* <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="payment"
                id="cod"
                value="Cash on Delivery"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cod" className="form-check-label">
                Cash on Delivery
              </label>
            </div> */}
          </div>

          <div className="text-center mt-5">
            <h3 className="fw-bold text-info mb-4">Total: ₹{total}</h3>
            <button
              onClick={handlePayment}
              className="btn btn-success btn-lg rounded-pill px-5"
            >
              Pay Now
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h4 className="text-secondary">No items found for payment.</h4>
          <button
            className="btn btn-outline-info mt-3 rounded-pill px-4"
            onClick={() => navigate("/products")}
          >
            Go to Products
          </button>
        </div>
      )}
    </div>
  );
}
