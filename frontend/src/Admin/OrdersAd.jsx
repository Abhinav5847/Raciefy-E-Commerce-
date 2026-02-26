import { useContext, useEffect } from "react";
import { AppContext } from "../Components/Components/AppProvider";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axiosInstance from "../api/axios";
import adminAxios from "../api/adminaxios";

export default function OrdersAd() {
  const { orders, setorders } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await adminAxios.get("/adminpanel/total_orders/");
        setorders(res.data);
      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [setorders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAxios.patch(
        `/adminpanel/total_orders/${orderId}/`,
        { status: newStatus }
      );

      setorders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const AdminOut = () => {
    localStorage.removeItem("adminID");
    navigate("/LoginAd");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      
   
    

   
      <div className="flex-grow-1 p-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="fw-bold mb-3">Orders Management</h3>
          <p className="text-muted">Manage and update customer orders</p>

          <div className="table-responsive mt-4">
            <table className="table table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Buyer</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">#{order.id}</td>
                      <td>{order.product?.name}</td>
                      <td>₹{order.product?.price}</td>
                      <td>{order.quantity}</td>
                      <td>{order.user?.name}</td>

                   
                      <td>
                        <div className="dropdown">
                          <button
                            className={`btn btn-sm dropdown-toggle ${
                              order.status === "DELIVERED"
                                ? "btn-success"
                                : order.status === "CANCELLED"
                                ? "btn-danger"
                                : order.status === "SHIPPED" ||
                                  order.status === "OUT_FOR_DELIVERY"
                                ? "btn-info text-white"
                                : "btn-warning"
                            }`}
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            {order.status.replaceAll("_", " ")}
                          </button>

                          <ul className="dropdown-menu shadow">
                            {[
                              "ORDERED",
                              "SHIPPED",
                              "OUT_FOR_DELIVERY",
                              "DELIVERED",
                              "CANCELLED",
                            ].map((status) => (
                              <li key={status}>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleStatusChange(order.id, status)
                                  }
                                >
                                  {status.replaceAll("_", " ")}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}