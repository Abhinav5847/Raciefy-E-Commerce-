import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Components/Components/AppProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function ProductsAd() {
  const { adminproducts, productDelete } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const handleCategory = (cate) => setSelectedCategory(cate);

  const uniqueCategories = [
    "All",
    ...new Set((adminproducts || []).map((i) => i.category)),
  ];

  const filteredProducts = (adminproducts || []).filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setSelectedCategory("All");
  }, [adminproducts]);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">

      <h2 className="fw-bold text-center mb-4">Manage Products</h2>

      {/* Search */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control w-50 text-center"
        />
      </div>

      {/* Categories */}
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${
              selectedCategory === cat
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Product */}
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/add-product")}
        >
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="row gy-4 gx-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
            >
              <div
                className="card text-center bg-white border-1 shadow-sm w-100"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/edit/${item.id}`)}
              >
                <div className="position-relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top p-3 img-fluid"
                    style={{ height: "180px", objectFit: "contain" }}
                  />
                </div>

                <div className="card-body">
                  <h6 className="card-title fw-bold text-dark">
                    {item.name}
                  </h6>

                  <p className="fw-bold text-primary mb-3">
                    ₹{item.price}
                  </p>

                  <div className="d-flex justify-content-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/edit/${item.id}`);
                      }}
                      className="btn btn-outline-info btn-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        productDelete(item.id);
                      }}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-muted w-100"
            style={{ height: "50vh" }}
          >
            <h5>No Products Found</h5>
          </div>
        )}
      </div>

    </div>
  );
}