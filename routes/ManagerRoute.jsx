
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);
 
  useEffect(() => {
    const checkManager = async () => {

      try {
        const res = await fetch('http://localhost:5000/api/auth/manager-data', {
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
    return <p>Loading...</p>;
  }

  return isManager ? children : navigate('/');
}
