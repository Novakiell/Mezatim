import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import CreateAuctionModal from '../components/CreateAuctionModal';
import PublishModal from '../components/PublishModal';
import { Plus, Archive, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modallar
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [publishItem, setPublishItem] = useState(null); 

  useEffect(() => {
    if (user) fetchInventory();
  }, [user]);

  const fetchInventory = async () => {
    setLoading(true);
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .eq('status', 'draft') // <--- SADECE TASLAKLAR
        .order('created_at', { ascending: false });
    
    setItems(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] pb-20 font-sans transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Breadcrumb */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 font-medium transition text-sm">
           <ChevronRight className="rotate-180" size={16}/> Panele Dön
        </Link>

        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600"><Archive size={28}/></div>
                Depom
            </h1>
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-200 dark:shadow-none cursor-pointer"
            >
                <Plus size={20}/> <span className="hidden sm:inline">Yeni Ürün Ekle</span>
            </button>
        </div>

        {loading ? (
            <p className="text-center text-indigo-500 mt-20 font-bold animate-pulse">Depo Yükleniyor...</p>
        ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-gray-400 text-lg mb-4">Deponuzda henüz taslak ürün yok.</p>
                <p className="text-sm text-gray-500">Ürünleri "Depoya Kaydet" diyerek buraya atabilirsiniz.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 flex gap-5 items-center shadow-sm hover:shadow-md transition-shadow">
                        <img src={item.image_url} className="w-28 h-28 object-cover rounded-2xl bg-gray-50" alt=""/>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Başlangıç: <span className="font-bold text-indigo-600 dark:text-indigo-400">₺{item.price}</span></p>
                            <button 
                                onClick={() => setPublishItem(item)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition w-full shadow-lg shadow-emerald-100 dark:shadow-none cursor-pointer active:scale-95"
                            >
                                Mezata Çıkar 🚀
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>

      {/* YENİ EKLEME MODALI */}
      {isCreateModalOpen && (
        <CreateAuctionModal 
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={fetchInventory} // Ekleme bitince depoyu yenile
        />
      )}

      {/* YAYINLAMA MODALI */}
      {publishItem && (
        <PublishModal 
            product={publishItem}
            onClose={() => setPublishItem(null)}
            onSuccess={fetchInventory} // Yayınlanınca depodan silinip ana sayfaya gider
        />
      )}

    </div>
  );
};

export default Inventory;