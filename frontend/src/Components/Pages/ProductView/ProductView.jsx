import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Components/AppProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../api/axios";

export default function ProductView() {
  const { addCart } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState();

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await axiosInstance.get(`product/productview/${id}/`);
        setItem(res.data);
      } catch (err) {
        console.log("error is:", err);
      }
    };
    fetching();
  }, [id]);

  if (!item) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <h2 className="text-info fw-bold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark text-light py-5 min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark border border-secondary shadow-lg text-light p-4 d-flex flex-column flex-md-row align-items-center gap-4 w-100" style={{ maxWidth: "850px" }}>
        

        <div className="text-center">
          <img
            src={item.image}
            alt={item.name}
            className="img-fluid rounded-4 shadow-sm"
            style={{
              maxWidth: "280px",
              height: "auto",
              objectFit: "contain",
              backgroundColor: "#111",
              padding: "10px",
            }}
          />
        </div>


        <div className="text-center text-md-start">
          <h2 className="fw-bold text-info mb-2">{item.name}</h2>
          <p className="text-secondary mb-1">Category: {item.category}</p>
          <h4 className="fw-bold text-success mb-4">₹{item.price}</h4>

          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
            <button
              className="btn btn-success rounded-pill px-4"
              onClick={() => addCart(item)}
            >
               Add to Cart
            </button>

            <button
              className="btn btn-outline-info rounded-pill px-4"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
