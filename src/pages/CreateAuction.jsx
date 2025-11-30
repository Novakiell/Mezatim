import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, DollarSign, Clock, Tag } from 'lucide-react';

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    buyNowPrice: '',
    image_url: '',
    duration: '3' // Varsayılan 3 gün
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Lütfen önce giriş yapın!");

    setLoading(true);

    try {
      // 1. Profil bilgilerini çek (Satıcı ismini almak için)
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, surname')
        .eq('id', user.id)
        .single();
      
      const sellerName = profile ? `${profile.name} ${profile.surname}` : 'Bilinmeyen Satıcı';

      // 2. Bitiş tarihini hesapla (Bugün + Seçilen Gün)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(formData.duration));

      // 3. Ürünü Veritabanına Ekle
      const { error } = await supabase.from('products').insert([
        {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price), // Başlangıç fiyatı
          start_price: Number(formData.price),
          buy_now_price: Number(formData.buyNowPrice),
          image_url: formData.image_url,
          end_time: endDate.toISOString(), // Tarih formatı
          seller_id: user.id,
          seller_name: sellerName,
          status: 'active'
        }
      ]);

      if (error) throw error;

      alert("Ürün başarıyla mezata açıldı! 🚀");
      navigate('/'); // Ana sayfaya dön

    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-200">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900">Mezat Başlat</h1>
            <p className="text-gray-500 mt-2">Ürününü listele, açık artırma heyecanı başlasın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Ürün Adı */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ürün Başlığı</label>
              <input required name="title" onChange={handleChange} type="text" placeholder="Örn: 1970 Model Daktilo" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* Resim URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Resim Linki (URL)</label>
              <div className="flex items-center gap-2">
                 <ImageIcon className="text-gray-400" />
                 <input required name="image_url" onChange={handleChange} type="text" placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <p className="text-xs text-gray-400 mt-1">*Şimdilik sadece resim linki kabul ediyoruz (Örn: Unsplash, Google Images linki).</p>
            </div>

            {/* Fiyatlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Başlangıç Fiyatı (₺)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-4 text-gray-400" />
                  <input required name="price" onChange={handleChange} type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hemen Al Fiyatı (₺)</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-4 text-gray-400" />
                  <input required name="buyNowPrice" onChange={handleChange} type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            {/* Süre ve Açıklama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Mezat Süresi</label>
                 <div className="relative">
                   <Clock size={16} className="absolute left-3 top-4 text-gray-400" />
                   <select name="duration" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                     <option value="1">1 Gün</option>
                     <option value="3">3 Gün</option>
                     <option value="7">7 Gün</option>
                   </select>
                 </div>
               </div>
               <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Açıklama</label>
                 <textarea required name="description" onChange={handleChange} rows="3" placeholder="Ürünün hikayesi, durumu..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
               </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50">
              {loading ? 'Mezat Oluşturuluyor...' : 'Mezatı Başlat 🚀'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;