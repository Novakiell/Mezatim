import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] flex flex-col items-center justify-center text-center px-4 font-sans transition-colors duration-300">
      
      <h1 className="text-9xl font-black text-indigo-600 dark:text-indigo-500 opacity-20 select-none">404</h1>
      
      <div className="absolute">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Hazine Kayıp! 🗺️</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto mb-8">
          Aradığın sayfa ya satıldı, ya silindi ya da hiç var olmadı. Ama üzülme, hala keşfedilecek binlerce mezat var.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-200 dark:shadow-none">
            <Home size={20} /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>

    </div>
  );
};

export default NotFound;