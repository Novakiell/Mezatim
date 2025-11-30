import React, { useState } from 'react';
import { Clock, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuctionCard = ({ data, isFavorite, onToggleFavorite }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Kalbe basınca çalışan fonksiyon
  const handleFavorite = async (e) => {
    e.preventDefault(); // Link'e gitmesini engelle
    if (!user) return toast.error("Favorilere eklemek için giriş yapmalısın!");
    if (loading) return;

    setLoading(true);
    
    try {
      if (isFavorite) {
        // Silme İşlemi
        const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', data.id);
        if (error) throw error;
        toast.success("Favorilerden çıkarıldı 💔");
      } else {
        // Ekleme İşlemi
        const { error } = await supabase.from('favorites').insert([{ user_id: user.id, product_id: data.id }]);
        if (error) throw error;
        toast.success("Favorilere eklendi ❤️");
      }
      onToggleFavorite(); // Home sayfasındaki listeyi güncelle
    } catch (err) {
      console.error(err);
      toast.error("Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link 
      to={`/auction/${data.id}`} 
      className="block group bg-white dark:bg-[#1E293B] rounded-3xl p-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer relative"
    >
      
      <div className="relative h-56 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img 
          src={Array.isArray(data.image) ? data.image[0] : data.image} 
          alt={data.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm ${
          data.status === 'Sıfır' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-black'
        }`}>
          {data.status || '2. El'}
        </span>
        
        {/* FAVORI BUTONU */}
        <button 
          onClick={handleFavorite} 
          className={`absolute top-3 right-3 backdrop-blur p-2.5 rounded-full transition-all z-10 shadow-sm ${
            isFavorite 
              ? 'bg-red-500 text-white hover:bg-red-600' // Favoriyse Kırmızı
              : 'bg-white/80 dark:bg-black/50 text-gray-400 hover:text-red-500 hover:bg-white' // Değilse Gri
          }`}
        >
          {/* Dolu veya Boş Kalp */}
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg">
          {data.category}
        </span>
      </div>

      <div className="p-3 pt-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-1">{data.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-8">{data.desc}</p>

        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xl font-black text-gray-900 dark:text-white">₺{data.currentBid}</p>
            <p className="text-[10px] text-gray-400 font-medium">↗ {data.bidCount} Teklif</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-400 font-medium">Hemen Satın Al</p>
             <p className="text-sm font-bold text-emerald-500">₺{data.buyNowPrice}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-4 bg-indigo-50 dark:bg-indigo-900/30 py-1.5 px-3 rounded-lg w-fit">
          <Clock className="w-4 h-4" />
          <span>{data.timeLeft}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-100 dark:shadow-none">
            Teklif Ver
          </div>
          <div className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-100 dark:shadow-none">
            Satın Al
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img src={data.sellerAvatar} alt="Seller" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate max-w-[100px]">{data.sellerName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-700 dark:text-indigo-400">
            <Eye className="w-3 h-3" />
            İncele
          </div>
        </div>

      </div>
    </Link>
  );
};

export default AuctionCard;