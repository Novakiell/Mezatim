import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Şifre sıfırlama maili gönder
      // redirectTo: Linke tıklayınca nereye gidecek? (UpdatePassword sayfasına)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast.success("Sıfırlama bağlantısı email adresinize gönderildi! 📩");
      
    } catch (error) {
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 px-4">
        <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Giriş'e Dön
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-xl rounded-3xl sm:px-10 relative">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32}/>
             </div>
             <h2 className="text-2xl font-black text-gray-900">Şifremi Unuttum</h2>
             <p className="text-gray-500 text-sm mt-2">Email adresini gir, sana sıfırlama bağlantısı gönderelim.</p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Adresi</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="ornek@email.com"
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;