import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { AppContext } from "../../Components/AppProvider";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const navigate = useNavigate();
  const { wishlist, addCart, toggleWishlist, home } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  
  const filteredProducts = home.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });


  const uniqueCategories = [...new Set(home.map((item) => item.category))];

  return (
    <>
      <div className="container-fluid py-5 bg-dark">
        <h1 className="text-center mb-4">All Products</h1>

   
        <div className="d-flex justify-content-center mb-4">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control w-25 text-center"
          />
        </div>

        <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
          <button
            className={`btn btn-primary btn-sm ${categoryFilter === "All" ? "active" : ""}`}
            onClick={() => setCategoryFilter("All")}
          >
            All
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-primary btn-sm ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

      
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => {
              const isWishlist = wishlist.some((w) => w.product.id === item.id);
              return (
                <div key={item.id} className="col-6 col-md-4 col-lg-3 d-flex justify-content-center">
                  <div
                    className="card product-card text-center bg-dark text-light border-1 shadow-sm"
                    style={{ cursor: "pointer", width: "100%" }}
                    onClick={() => navigate(`/ProductView/${item.id}`)}
                  >
                    <div className="position-relative">
                      <img
                        src={item.image} q
                        alt={item.name}
                        className="card-img-top p-3 img-fluid"
                        style={{ height: "180px", objectFit: "contain" }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        className="btn position-absolute top-0 end-0 m-2 p-1 border-0 bg-transparent"
                      >
                        <Heart
                          strokeWidth={1}
                          color={isWishlist ? "red" : "white"}
                          fill={isWishlist ? "red" : "none"}
                        />
                      </button>
                    </div>
                    <div className="card-body">
                      <h6 className="card-title fw-bold">{item.name}</h6>
                      <p className="fw-bold text-info mb-3">₹{item.price}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addCart(item);
                        }}
                        className="btn btn-outline-info btn-sm rounded-pill"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="d-flex flex-column justify-content-center align-items-center text-light w-100"
              style={{ height: "60vh", backgroundColor: "#212529", borderRadius: 8 }}
            >
              <h3 className="fw-bold text-info">No Products Found</h3>    
            </div>
          )}
        </div>
      </div>

      <footer className="bg-black text-center text-secondary py-4">
        <p className="mb-0">
          © {new Date().getFullYear()} ReceiFy — Built for Speed & Passion.
        </p>
      </footer>
    </>
  );
}
