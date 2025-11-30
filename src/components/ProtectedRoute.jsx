import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (user && adminOnly) {
      const checkAdmin = async () => {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
        setIsAdmin(data?.is_admin || false);
        setCheckingAdmin(false);
      };
      checkAdmin();
    } else {
      setCheckingAdmin(false);
    }
  }, [user, adminOnly]);

  // 1. Auth Yükleniyorsa Bekle
  if (loading || (adminOnly && checkingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0F172A]">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  // 2. Giriş Yapmamışsa -> Login'e at
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Admin Sayfasıysa ve Admin Değilse -> Ana Sayfaya at
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 4. Her şey yolundaysa sayfayı göster
  return children;
};

export default ProtectedRoute;