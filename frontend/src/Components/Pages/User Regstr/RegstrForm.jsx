import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { useState } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RegstrForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();


    if (!formData.name || !formData.email || !formData.password || !formData.confirmpassword) {
      setError("All fields are required!");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axiosInstance.post('/auth/register/',{
        name:formData.name,
        email:formData.email.trim().toLowerCase(),
        password:formData.password,
        password2:formData.confirmpassword,
      })

      setError("");
      Swal.fire({
        title: "Registration Successful!",
        text: "You can now log in to your account.",
        icon: "success",
        confirmButtonText: "OK",
        heightAuto: false,
      }).then(() => navigate("/Login"));
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div
        className="card p-5 shadow-lg text-light"
        style={{
          width: "450px",
          backgroundColor: "rgb(20, 20, 20)",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-4 text-info fw-bold">Create Account</h2>

        <form onSubmit={formSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">Email</label>
            <input
              type="email"
              name="email"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">Password</label>
            <input
              type="password"
              name="password"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Re-enter password"
              value={formData.confirmpassword}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-danger text-center mb-3">{error}</p>}

          <button type="submit" className="btn btn-info w-100 fw-semibold text-light rounded-pill">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-secondary">
          Already have an account?{" "}
          <span
            className="text-info fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/Login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
