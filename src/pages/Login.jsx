import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      navigate('/'); // Başarılıysa ana sayfaya
      
    } catch (error) {
      let msg = error.message;
      if (msg.includes("Invalid login credentials")) msg = "Email adresi veya şifre yanlış!";
      if (msg.includes("Email not confirmed")) msg = "Email adresi doğrulanmamış.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      
      {/* Geri Dön Linki */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[500px] mb-6 px-4">
        <Link to="/" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[500px]">
        <div className="bg-white dark:bg-[#1E293B] py-16 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] sm:px-10 relative overflow-hidden border border-gray-100 dark:border-gray-700">
          
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-8">Giriş Yap</h2>

          {errorMsg && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Adresi</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3.5 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 dark:bg-gray-800/50 text-gray-800 dark:text-white placeholder-gray-400"
                placeholder="mail@ornek.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Şifre</label>
                
                {/* --- İŞTE EKSİK OLAN LİNK BURADA --- */}
                <Link to="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-bold hover:underline">
                  Şifremi Unuttum?
                </Link>
                {/* ----------------------------------- */}

              </div>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3.5 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 dark:bg-gray-800/50 text-gray-800 dark:text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1E293B] text-gray-500">veya</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
               Hesabınız yok mu? <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Hemen Kayıt Ol</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;