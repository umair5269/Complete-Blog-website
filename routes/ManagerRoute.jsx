
import LoadingPage from '@/src/components/LoadingPage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
 
  useEffect(() => {
    const checkManager = async () => {

      try {
        const res = await fetch(`${API_URL}/api/auth/manager-data`, {
          method: 'GET',
          credentials: "include",
        });

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        if (res.status === 403) {
          navigate('/');
          return;
        }

        const data = await res.json();
        if (data?.role === 'manager') {
          setIsManager(true);
        } else {
          navigate('/');
        }

        setLoading(false); 
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };

    checkManager();
  }, [navigate]);

  if (loading) {
    return <LoadingPage/>;
  }

  return isManager ? children : navigate('/');
}
