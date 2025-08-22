import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
