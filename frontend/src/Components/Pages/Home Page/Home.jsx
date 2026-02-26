import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { AppContext } from "../../Components/AppProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user, wishlist = [], addCart, toggleWishlist,home } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const homeproducts = home.slice(0,8)

  

  return (
    <div className="bg-dark text-light overflow-hidden">
    
      <section className="container-fluid py-5 hero-section text-center text-md-start">
        <div className="container py-5">
          <div className="row align-items-center gy-4">
            <div className="col-md-6">
              <h1 className="display-5 fw-bold text-uppercase mb-3 text-info">
                Drive the Future
              </h1>
              <p className="lead text-secondary">
                Discover the ultimate collection of RC cars and legendary miniatures. Speed, precision, and style — all in one place.
              </p>
              <button
                className="btn btn-outline-info btn-lg rounded-pill mt-3"
                onClick={() => navigate("/Products")}
              >
                Explore Collection
              </button>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="/images/download.png"
                alt="Hero Car"
                className="img-fluid rounded-4 shadow-lg hero-image"
              />
            </div>
          </div>
        </div>
      </section>

   
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-uppercase text-info">Build Your Dream Garage</h2>
          <p className="text-secondary w-75 mx-auto">
            Collect, customize, and race your dream RC cars. From classic icons to futuristic beasts — the thrill starts here.
          </p>
        </div>
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <div className="p-4 bg-secondary bg-opacity-10 rounded-4">
              <h4 className="fw-bold text-info mb-3">Experience Thrills on Every Track</h4>
              <p className="text-light opacity-75">
                Race through exciting tracks, master unique challenges, and push your cars to the limit. Feel the adrenaline each turn unlock new rewards for your ultimate collection.
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-4 bg-secondary bg-opacity-10 rounded-4">
              <h4 className="fw-bold text-info mb-3">Collect & Customize Like Never Before</h4>
              <p className="text-light opacity-75">
                Choose from exclusive limited-edition cars, unlock customization options, and design your own collection with stunning details and speed-inspired aesthetics.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      {<section className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-uppercase text-info">Limited Collections</h2>
        <div className="row g-4 justify-content-center">
          {homeproducts.map((item) => {
            const isWishlist = wishlist.some((w) => w.id === item.id);
            return (
              <div key={item.id} className="col-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div
                  className="card product-card text-center bg-dark text-light border-1 shadow-sm"
                  onClick={() => navigate(`/ProductView/${item.id}`)}
                >
                  <div className="position-relative">
                    <img
                      src={item.image}
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
                      <Heart strokeWidth={1} color={wishlist.some((w) => w.product?.id === item.id) ? "red" : "white"}
    fill={wishlist.some((w) => w.product?.id === item.id) ? "red" : "none"} />
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
          })}
        </div>

        <div className="text-center mt-5">
          <button className="btn btn-info text-dark rounded-pill px-4 py-2" onClick={() => navigate("/Products")}>
            View More
          </button>
        </div>
      </section> }

      <footer className="bg-black text-center text-secondary py-4 mt-5">
        <p className="mb-0">© {new Date().getFullYear()} RaceiFy — Built for Speed & Passion.</p>
      </footer>
    </div>
  );
}
