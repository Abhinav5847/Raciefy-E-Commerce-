import { useContext, useState } from "react";
import { AppContext } from "../../Components/AppProvider";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios"; // your axios instance
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login/", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      });

      login(res.data.access, res.data.refresh);

      navigate("/")
    } catch (err) {
      console.error(err);
    
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card p-5 shadow-lg text-light" style={{ width: "400px", borderRadius: "15px", backgroundColor: "rgb(20,20,20)" }}>
        <h2 className="text-center mb-4 text-info fw-bold">User Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-secondary">Email</label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-info w-100 fw-semibold text-light rounded-pill">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-secondary">
          Don’t have an account?{" "}
          <span className="text-info fw-bold" style={{ cursor: "pointer" }} onClick={() => navigate("/Regstr")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
