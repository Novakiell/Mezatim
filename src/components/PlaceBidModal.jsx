import React, { useState, useEffect } from 'react';
import { X, Loader2, TrendingUp, AlertCircle, Wallet } from 'lucide-react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const PlaceBidModal = ({ product, user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  
  const minBid = Number(product.price) + (Number(product.bid_increment) || 50);
  const [bidAmount, setBidAmount] = useState(minBid);

  // Kullanıcının güncel bakiyesini çek
  useEffect(() => {
    const fetchBalance = async () => {
      const { data } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
      if (data) setUserBalance(data.balance || 0);
    };
    fetchBalance();
  }, [user]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    // Frontend Kontrolü (Hız için)
    if (bidAmount < minBid) {
      return toast.error(`En düşük teklif ₺${minBid.toLocaleString()} olmalıdır.`);
    }
    
    // Bakiye Kontrolü (Görsel uyarı)
    if (userBalance < bidAmount) {
        return toast.error("Bakiye yetersiz! Lütfen cüzdanınıza para yükleyin.");
    }

    setLoading(true);

    try {
      // --- GÜVENLİ TEKLİF İŞLEMİ (RPC) ---
      const { error } = await supabase.rpc('place_bid', {
        p_product_id: product.id,
        p_bid_amount: bidAmount,
        p_user_id: user.id
      });

      if (error) throw error;

      toast.success("Teklifiniz alındı! Bol şans 🍀");
      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      // Veritabanından gelen özel hata mesajını göster (Örn: "Süre doldu")
      toast.error(err.message || "Teklif verilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300">
        
        {/* Başlık */}
        <div className="bg-indigo-600 p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Teklif Ver</h2>
          <p className="text-indigo-200 text-sm mt-1">{product.title}</p>
        </div>

        <div className="p-8">
          
          {/* Cüzdan Bilgisi */}
          <div className="flex justify-between items-center mb-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
             <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                <Wallet size={20}/> Cüzdanım:
             </div>
             <div className="text-xl font-black text-gray-900 dark:text-white">
                ₺{userBalance.toLocaleString()}
             </div>
          </div>

          {/* Fiyat Bilgileri */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-center border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Şu Anki Fiyat</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">₺{product.price.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl text-center border border-orange-100 dark:border-orange-800">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase">Min. Artış</p>
              <p className="text-lg font-black text-orange-600 dark:text-orange-400">+₺{product.bid_increment || 50}</p>
            </div>
          </div>

          <form onSubmit={handleBidSubmit}>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Teklifiniz (₺)</label>
            <div className="relative mb-6">
              <div className="absolute left-4 top-3.5 text-gray-400">
                <TrendingUp size={20} />
              </div>
              <input 
                type="number" 
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={minBid}
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 focus:border-indigo-500 rounded-2xl py-3 pl-12 pr-4 text-xl font-bold text-gray-900 dark:text-white outline-none transition-all"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Teklifi Onayla'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Teklif vererek satın alma kurallarını kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceBidModal;