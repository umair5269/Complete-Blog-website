
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/admin-data', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        if (res.status === 403) {
          navigate('/'); // not admin
          return;
        }

        const data = await res.json();
        if (data?.role === 'admin') {
          setIsAdmin(true);
        } else {
          navigate('/');
        }

        setLoading(false); 
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };

    checkAdmin();
  }, [token, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isAdmin ? children : null;
}
