import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminAxios from "../api/adminaxios";

export default function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("admin_access");
        const res = await adminAxios.get(`adminpanel/user_view/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading user details...</p>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center mt-5">{error}</div>
    );

  if (!user)
    return (
      <div className="alert alert-warning text-center mt-5">
        No user data found.
      </div>
    );

  return (
    <div className="container my-4 vh-100">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">User Details</h3>
        </div>

        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-6"><strong>ID:</strong> {user.id}</div>
            <div className="col-md-6"><strong>Name:</strong> {user.name}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6"><strong>Email:</strong> {user.email}</div>
            <div className="col-md-6"><strong>Verified:</strong> {user.is_verified ? "Yes" : "No"}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6"><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</div>
            <div className="col-md-6"><strong>Staff:</strong> {user.is_staff ? "Yes" : "No"}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6"><strong>Date Joined:</strong> {new Date(user.date_joined).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}