import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Şifre en az 6 karakter olmalıdır.");
    
    setLoading(true);
    try {
      // Kullanıcının şifresini güncelle
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;

      toast.success("Şifreniz başarıyla güncellendi! Giriş yapılıyor... 🔓");
      
      // 2 saniye sonra ana sayfaya at
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-xl rounded-3xl sm:px-10">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32}/>
             </div>
             <h2 className="text-2xl font-black text-gray-900">Yeni Şifre Belirle</h2>
             <p className="text-gray-500 text-sm mt-2">Lütfen yeni ve güvenli bir şifre girin.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-green-200 text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;