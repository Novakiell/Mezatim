import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    city: 'İstanbul'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Supabase Auth'a Kayıt
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // 2. Profiles tablosuna ekle (ARTIK ID'Yİ DE GÖNDERİYORUZ)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id, // <--- KRİTİK NOKTA: Auth ID ile eşleşiyor
            email: formData.email,
            name: formData.name,
            surname: formData.surname,
            city: formData.city
          }]);
        
        if (profileError) {
          console.error('Profil hatası:', profileError);
          // Profil oluşmazsa kullanıcıya hissettirme, devam etsin
        }
        
        alert("Kayıt Başarılı! Giriş yapılıyor...");
        navigate('/login');
      }

    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
       <div className="sm:mx-auto sm:w-full sm:max-w-[800px] mb-6 px-4">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[800px]">
        <div className="bg-white py-12 px-6 shadow-sm rounded-[2rem] sm:px-12 relative">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">Kayıt Ol</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Ad</label>
                <input required name="name" onChange={handleChange} type="text" className="block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Soyad</label>
                <input required name="surname" onChange={handleChange} type="text" className="block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input required name="email" onChange={handleChange} type="email" className="block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Şifre</label>
              <input required name="password" onChange={handleChange} type="password" className="block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50">
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
             Zaten Hesabınız Var Mı? <Link to="/login" className="font-bold text-gray-900 hover:underline">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;