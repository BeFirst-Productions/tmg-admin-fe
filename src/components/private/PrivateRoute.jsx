import { getAccessToken, setAccessToken } from "@/api/tokenService";
import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (token) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      // Try refresh token
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(res.data.data.accessToken);
        setAllowed(true);
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!allowed) return <Navigate to="/login" replace />;

  return children;
}
