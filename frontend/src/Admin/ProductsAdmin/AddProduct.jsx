import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";
import adminAxios from "../../api/adminaxios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "../../Components/Components/AppProvider";

export default function AddProduct() {
  const navigate = useNavigate();
  const { AdminProductFetching } = useContext(AppContext);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null) formData.append(key, form[key]);
      });

      await adminAxios.post("adminpanel/product_list/", formData);

  
      if (AdminProductFetching) await AdminProductFetching();

     const Toast = Swal.mixin({
           toast: true,
           position: "top-end",
           showConfirmButton: false,
           timer: 2000,
           timerProgressBar: true,
           didOpen: (toast) => {
             toast.addEventListener("mouseenter", Swal.stopTimer);
             toast.addEventListener("mouseleave", Swal.resumeTimer);
           },
         });
     
         Toast.fire({
           icon: "success",
           title: "Product updated successfully!",
         });

     
      navigate("/admin/products");
    } catch (err) {
      console.error(err);

     
      let message = "Failed to add product";
      if (err.response?.data) {
      
        if (typeof err.response.data === "object") {
          message = Object.values(err.response.data)
            .flat()
            .join("\n");
        } else {
          message = err.response.data;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <div className="container py-5">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <h3 className="mb-0 fw-bold">Add New Product</h3>
        </div>

        <div className="card shadow-lg border-0 rounded-4 p-4">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control rounded-3"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold mt-3">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control rounded-3"
                  value={form.price}
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold mt-3">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control rounded-3"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold mt-3">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control rounded-3"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-control rounded-3"
                  value={form.description}
                  onChange={handleChange}
                  required
                ></textarea>

                <label className="form-label fw-semibold mt-3">
                  Upload Image
                </label>
                <div className="border rounded-4 p-4 text-center bg-light position-relative">
                  <UploadCloud size={32} className="mb-2 text-secondary" />
                  <p className="text-muted mb-2">Click to upload product image</p>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImage}
                    required
                  />
                </div>

                {preview && (
                  <div className="mt-3 text-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-fluid rounded-3 shadow-sm"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn btn-primary px-4 rounded-3"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}