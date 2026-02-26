import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminAxios from "../api/adminaxios";
import "./EditAd.css";
import { ArrowLeft} from "lucide-react";
import Swal from "sweetalert2";
import { AppContext } from "../Components/Components/AppProvider";


export default function EditAd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {AdminProductFetching} = useContext(AppContext)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null, 
  });

  const [preview, setPreview] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await adminAxios.get(`/adminpanel/product/${id}/`);
        setForm({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          category: res.data.category,
          image: null,
        });
        setPreview(res.data.image); 
        setLoading(false);
      } catch (err) {
        console.log(err.response?.data || err);
        setErrorMsg("Failed to fetch product.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

  
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);

      if (form.image) {
        data.append("image", form.image); 
      }

      await adminAxios.patch(`/adminpanel/product/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if(AdminProductFetching) await AdminProductFetching()
      
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

      navigate(-1); 
    } catch (err) {
      console.log(err.response?.data || err);
      setErrorMsg("Failed to update product. Check inputs and try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading product...</h4>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container col-md-6 bg-light p-5 rounded shadow">
       <button
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <h3 className="mb-4 text-center">Edit Product</h3>
    

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
 
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

   
          <div className="mb-3">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>


          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="img-fluid mt-2 rounded shadow-sm"
                style={{ maxHeight: "200px" }}
              />
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}