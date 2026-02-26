import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const AdminOut = () => {
    localStorage.removeItem("admin_access");
    navigate("/LoginAd");
    alert("Admin Log Out success");
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">

       
        <div className="col-md-2 bg-dark text-white d-flex flex-column p-4 vh-100 sticky-top">
          <h4 className="text-center mb-4">Admin Panel</h4>

          <button className="btn btn-outline-light mb-2"
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </button>

          <button className="btn btn-outline-light mb-2"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>

          <button className="btn btn-outline-light mb-2"
            onClick={() => navigate("/admin/products")}
          >
            Manage Products
          </button>

          <button className="btn btn-outline-light mb-2"
            onClick={() => navigate("/admin/orders")}
          >
            Orders
          </button>

          <button className="btn btn-danger mt-auto"
            onClick={AdminOut}
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="col-md-10 bg-light p-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
}