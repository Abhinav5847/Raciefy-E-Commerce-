import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/order/");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container-fluid bg-dark min-vh-100 py-5">
      <h1 className="text-center mb-5 text-dark">Your Orders</h1>

      {orders.length > 0 ? (
        <div className="container">
          {orders.map((item) => (
            <div
              key={item.id}
              className="card mb-4 shadow-sm rounded-3 overflow-hidden border-0"
            >
              <div className="row g-0 align-items-center">
             
                <div className="col-md-4">
                  <img
                    src={item.product?.image || "/default-product.png"}
                    alt={item.product?.name || "Product"}
                    className="img-fluid p-3"
                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                  />
                </div>

        
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-primary">
                      {item.product?.name || "Product Name"}
                    </h5>

                    <p className="card-text mb-2">
                      <strong>Price:</strong> ₹{item.product?.price}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Total:</strong> ₹{item.total_price}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Ordered On:</strong>{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>

                    <span
                      className={`badge ${
                        item.status === "DELIVERED"
                          ? "bg-success"
                          : item.status === "CANCELLED"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5 text-muted">
          <h4>No orders found.</h4>
        </div>
      )}
    </div>
  );
}
