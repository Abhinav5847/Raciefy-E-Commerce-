import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Components/AppProvider";
import axiosInstance from "../../../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Cart() {
  const { cart,removeCartitem,updateCartitem} = useContext(AppContext);
  const navigate = useNavigate();

  const increaseQty = (item) => {
      updateCartitem(item.id,+ 1)
  };

  const decreaseQty = (item) => {
    const qt = Number(item.quantity)
    if(qt > 1){
      updateCartitem(item.id,- 1)
    }
    else{
      removeCartitem(item.id)
    }
  }


  const buyBtn = (item) => {
    const total = item.price * item.quantity;
    navigate("/Payment", { state: { cart: [item], total } });
  };

  const total = cart.reduce((sum, item) => sum + Number(item.item_total), 0);

  return (
    <div className="container-fluid py-5 bg-dark text-light min-vh-100 overflow-hidden">
      <h1 className="text-center mb-5 text-info fw-bold">Your Cart</h1>

      {cart.length > 0 ? (
        <>
          <div className="row g-4 justify-content-center">
            {cart.map((item) => (
              <div
                key={item.id}
                className="col-12 col-md-10 col-lg-8 d-flex justify-content-center"
              >
                <div className="card bg-dark text-light border border-secondary shadow-sm w-100 p-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-4">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="img-fluid rounded-3"
                      style={{ height: "120px", width: "120px", objectFit: "contain" }}
                    />
                    <div>
                      <h5 className="fw-bold">{item.product_name}</h5>
                      <p className="text-info fw-bold mb-1">₹{item.item_total}</p>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-light btn-sm rounded-circle"
                          onClick={() => decreaseQty(item)}
                        >
                          −
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="btn btn-outline-light btn-sm rounded-circle"
                          onClick={() => increaseQty(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-center gap-2 mt-3 mt-md-0">
                    <button
                      onClick={() => buyBtn(item)}
                      className="btn btn-danger btn-sm rounded-pill px-4"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => removeCartitem(item.id)}
                      className="btn btn-outline-light btn-sm rounded-pill px-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <h3 className="fw-bold text-info mb-4">Total: ₹{total}</h3>
            <button
              onClick={() => navigate("/Payment", {state:{ cart, total }})}
              className="btn btn-success btn-lg rounded-pill px-5"
            >
              Pay for All
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h4 className="text-secondary">No items in your cart.</h4>
          <button
            className="btn btn-outline-info mt-3 rounded-pill px-4"
            onClick={() => navigate("/Products")}
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}
