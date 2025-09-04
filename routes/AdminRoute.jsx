
import LoadingPage from '@/src/components/LoadingPage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  

  useEffect(() => {
    const checkAdmin = async () => {

      try {
        const res = await fetch(`${API_URL}/api/auth/admin-data`, {
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
  }, [navigate]);

  if (loading) {
    return <LoadingPage/>;
  }

  return isAdmin ? children : navigate('/');
}
