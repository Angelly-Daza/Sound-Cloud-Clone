import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase/client';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/login');
      } else {
        navigate('/');
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  return children;
}
