import { useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AppContext } from "../Components/Components/AppProvider";
import adminAxios from "../api/adminaxios";

export default function UsersAd() {
  const navigate = useNavigate();

  const { users = [], adminFetchusers } = useContext(AppContext);

  // ✅ Fetch users when page loads
  useEffect(() => {
    if (adminFetchusers) {
      adminFetchusers();
    }
  }, []);

  // ✅ Toggle Block / Activate
  const toggleActive = async (userItem) => {
    const actionText = userItem.is_active ? "Block" : "Activate";

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${actionText} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      await adminAxios.patch(
        `/adminpanel/status_toggle/${userItem.id}/`,
        {}
      );

      await adminFetchusers();

      Swal.fire({
        icon: "success",
        title: `${actionText}d Successfully`,
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: err.response?.data?.error || "Try again later",
      });
    }
  };

  // ✅ Soft Delete
  const delete_user = async (user_id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be soft deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await adminAxios.patch(
        `/adminpanel/soft_delete/${user_id}/`,
        {}
      );

      await adminFetchusers();

      Swal.fire({
        icon: "success",
        title: "User deleted successfully",
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="container-fluid py-5 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1">Users List</h2>
        <div style={{ width: "30px" }}></div>
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users && users.length > 0 ? (
              users.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button
                      onClick={() => toggleActive(item)}
                      className={`btn btn-sm me-2 ${
                        item.is_active ? "btn-warning" : "btn-success"
                      }`}
                    >
                      {item.is_active ? "Block" : "Activate"}
                    </button>

                    <button
                      onClick={() => navigate(`/admin/user/${item.id}`)}
                      className="btn btn-info btn-sm me-2"
                    >
                      View
                    </button>

                    <button
                      onClick={() => delete_user(item.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}