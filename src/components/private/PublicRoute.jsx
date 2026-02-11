import { Navigate } from "react-router-dom";
import { getAccessToken } from "@/services/tokenService";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = getAccessToken();

      // 1️⃣ If access token exists → user already logged in
      if (!token) {
        setAllowed(false); // do NOT allow /login
        setLoading(false);
        return;
      }

      // 2️⃣ No access token → Try refresh token
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Refresh success → user logged in
        setAllowed(false);
      } catch (err) {
        // Refresh failed → user NOT logged in
        setAllowed(true);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If not allowed → user is logged in → redirect to dashboard
  if (!allowed) {
    return <Navigate to="/user-management" replace />;
  }

  // Allowed → user NOT logged in → show login page
  return children;
}
