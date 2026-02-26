import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useContext, useMemo } from "react";
import { AppContext } from "../../Components/Components/AppProvider";

export default function HomeAd() {
  const navigate = useNavigate();
  const { home, users, orders } = useContext(AppContext);

  const AdminOut = () => {
    localStorage.removeItem("admin_access");
    navigate("/LoginAd");
    alert("Admin Log Out success");
  };

  const totalRevenue = useMemo(() => {
    return (orders || []).reduce((acc, order) => {
      const price = order.product?.price || 0;
      const quantity = order.quantity || 0;
      return acc + price * quantity;
    }, 0);
  }, [orders]);


  const completedOrder = useMemo(() => {
    return (orders || []).filter(
      (order) => order.status === "DELIVERED"
    ).length;
  }, [orders]);

  const pendingOrder = useMemo(() => {
    return (orders || []).filter(
      (order) => order.status !== "completed"
    ).length;
  }, [orders]);

 
  const salesData = useMemo(() => {
    const monthly = {};

    (orders || []).forEach((order) => {
      const dateValue = order.created_at || order.createdAt;
      if (!dateValue) return;

      const date = new Date(dateValue);
      const monthIndex = date.getMonth();

      const price = order.product?.price || 0;
      const qty = order.quantity || 0;
      const amount = price * qty;

      monthly[monthIndex] = (monthly[monthIndex] || 0) + amount;
    });

    return Object.keys(monthly)
      .sort((a, b) => a - b)
      .map((monthIndex) => ({
        month: new Date(0, monthIndex).toLocaleString("default", {
          month: "short",
        }),
        sales: monthly[monthIndex],
      }));
  }, [orders]);

  const orderStatusData = [
    { name: "Completed", value: completedOrder },
    { name: "Pending", value: pendingOrder },
  ];

  const COLORS = ["#28a745", "#ffc107"];

  const usersData = [
    { name: "Products", value: home?.length || 0 },
    { name: "Users", value: users?.length || 0 },
    { name: "Orders", value: orders?.length || 0 },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">

     
       


        <div className="col-md-10 bg-light p-4">
          <h2 className="fw-bold mb-4 text-center">
            Dashboard Overview
          </h2>

          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card shadow-sm p-3 text-center">
                <h6>Total Revenue</h6>
                <h4 className="text-success">
                  ₹ {totalRevenue.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm p-3 text-center">
                <h6>Total Orders</h6>
                <h4>{orders?.length || 0}</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm p-3 text-center">
                <h6>Completed Orders</h6>
                <h4 className="text-success">{completedOrder}</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm p-3 text-center">
                <h6>Pending Orders</h6>
                <h4 className="text-warning">{pendingOrder}</h4>
              </div>
            </div>
          </div>


          <div className="row">

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-3 border-0">
                <h6 className="text-center mb-3">Monthly Sales</h6>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#007bff"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

       
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-3 border-0">
                <h6 className="text-center mb-3">Order Status</h6>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

 
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm p-3 border-0">
                <h6 className="text-center mb-3">
                  Platform Statistics
                </h6>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#6f42c1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}