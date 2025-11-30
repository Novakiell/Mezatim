import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import CreateAuctionModal from './CreateAuctionModal';

const MobileBottomNav = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hangi sayfanın aktif olduğunu kontrol et
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* --- ALT MENÜ ÇUBUĞU --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-6 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex justify-between items-center h-20">
        
        {/* ANA SAYFA */}
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}>
          <Home size={24} className={isActive('/') ? 'fill-current' : ''} />
          <span className="text-[10px] font-bold">Keşfet</span>
        </Link>

        {/* ARAMA (Mobilde arama sayfasına veya focus'a yönlendirebiliriz, şimdilik dashboard'un mybids'ine atalım örnek olarak veya boş link) */}
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}>
          <Search size={24} />
          <span className="text-[10px] font-bold">Panel</span>
        </Link>

        {/* ORTA BUTON (EKLE) - YUKARI TAŞAN TASARIM */}
        <div className="relative -top-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-105 transition active:scale-95 border-4 border-[#F8F9FA] dark:border-[#0F172A]"
          >
            <Plus size={28} />
          </button>
        </div>

        {/* FAVORİLER (Dashboard içindeki favoriler tabına yönlendiririz aslında ama şimdilik görsel) */}
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
          <Heart size={24} />
          <span className="text-[10px] font-bold">Favoriler</span>
        </Link>

        {/* PROFİL */}
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
          <User size={24} />
          <span className="text-[10px] font-bold">Hesabım</span>
        </Link>

      </div>

      {/* MODAL (Burada da çağırıyoruz ki her yerden açılabilsin) */}
      {isModalOpen && (
        <CreateAuctionModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => window.location.reload()} // Basitçe sayfayı yenilesin
        />
      )}
    </>
  );
};

export default MobileBottomNav;