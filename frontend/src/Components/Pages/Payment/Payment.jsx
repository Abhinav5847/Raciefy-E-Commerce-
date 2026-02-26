import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import LastPay from "./LastPay";
export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart } = location.state || { cart: []};


  return (
    <div className="container-fluid py-5 bg-dark text-light min-vh-100 overflow-hidden">
      <h1 className="text-center mb-5 text-info">Payment Summary</h1>

      {cart.length > 0 ? (
        <>
          <div className="row g-4 justify-content-center">
            {cart.map((item) => (
              <div
                key={item.id}
                className="col-10 col-md-6 col-lg-4 d-flex justify-content-center"
              >
                <div className="card bg-dark text-light border border-secondary shadow-sm text-center p-3">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="card-img-top p-3 img-fluid"
                    style={{
                      height: "180px",
                      objectFit: "contain",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{item.product_name}</h5>
                    <p className="fw-bold text-info mb-1">₹{item.item_total}</p>
                    <p className="text-secondary">Quantity: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <LastPay />
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h4 className="text-secondary">No items found for payment.</h4>
          <button
            className="btn btn-outline-info mt-3 rounded-pill px-4"
            onClick={() => navigate("/Products")}
          >
            Go to Products
          </button>
        </div>
      )}
    </div>
  );
}
