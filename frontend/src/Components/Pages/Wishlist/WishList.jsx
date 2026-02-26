import axios from "axios";
import { useContext, useEffect } from "react";
import { AppContext } from "../../Components/AppProvider";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WishList() {
  const { wishlist, addCart, toggleWishlist, fetchWishlist } = useContext(AppContext);

  
  useEffect(() => {
    fetchWishlist();
  },[]);

  return (
    <div className="container-fluid py-5 bg-dark text-light min-vh-100 overflow-hidden">
      <h1 className="text-center mb-5">Your Wishlist</h1>

      {wishlist.length > 0 ? (
        <div className="row g-4 justify-content-center">
          {wishlist.map((item) => (
            <div
              key={item.id} 
              className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
            >
              <div
                className="card bg-dark text-light border-0 shadow-sm text-center"
                style={{ width: "100%", maxWidth: "250px" }}
              >
                <img
                  src={item.product.image} 
                  className="card-img-top p-3 img-fluid"
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.product.name}</h5>
                  <p className="fw-bold text-info mb-3">₹{item.product.price}</p>

                  <div className="d-flex justify-content-center gap-2">
                    <button
                      onClick={() => toggleWishlist(item.product)}
                      className="btn btn-danger btn-sm rounded-pill"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => addCart(item.product)}
                      className="btn btn-outline-info btn-sm rounded-pill"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <h3 className="text-secondary">No items in your wishlist</h3>
        </div>
      )}
    </div>
  );
}
