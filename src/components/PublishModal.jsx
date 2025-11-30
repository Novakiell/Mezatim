import React, { useState } from 'react';
import { X, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const PublishModal = ({ product, onClose, onSuccess }) => {
  const [days, setDays] = useState(1);
  const [hours, setHours] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (days === 0 && hours === 0) return alert("Lütfen bir süre giriniz!");
    
    setLoading(true);

    // Bitiş Tarihini Hesapla
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));
    endDate.setHours(endDate.getHours() + parseInt(hours));

    try {
        const { error } = await supabase
            .from('products')
            .update({ 
                status: 'active', // Durumu Aktif yap
                end_time: endDate.toISOString(), // Süreyi başlat
                created_at: new Date().toISOString() // En başa gelmesi için tarihini güncelle
            })
            .eq('id', product.id);

        if (error) throw error;
        
        alert("Ürün Mezata Çıkarıldı! 🔥");
        onSuccess(); // Listeyi yenile
        onClose();   // Modalı kapat

    } catch (err) {
        alert("Hata: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-sm rounded-2xl shadow-xl p-6 relative animate-in zoom-in duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition cursor-pointer">
            <X size={20} className="dark:text-white"/>
        </button>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Mezat Süresi Seç</h3>
        <p className="text-sm text-gray-500 mb-6 truncate">{product.title}</p>

        <div className="flex gap-4 mb-6">
            <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block">Gün</label>
                <input type="number" min="0" value={days} onChange={e => setDays(e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 outline-none focus:border-indigo-500 dark:bg-gray-800 dark:text-white"/>
            </div>
            <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block">Saat</label>
                <input type="number" min="0" max="23" value={hours} onChange={e => setHours(e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 outline-none focus:border-indigo-500 dark:bg-gray-800 dark:text-white"/>
            </div>
        </div>

        <button 
            onClick={handlePublish} 
            disabled={loading} 
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-indigo-200 dark:shadow-none"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Başlat 🚀'}
        </button>
      </div>
    </div>
  );
};

export default PublishModal;