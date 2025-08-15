
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/admin-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403) {
          navigate('/');
          return;
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

  return children;
}
