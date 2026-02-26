import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/auth/verify-email/${token}/`);
        setMessage(res.data.message);

        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>{message}</h2>
      <p>You will be redirected to login shortly...</p>
    </div>
  );
}
