import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-sm rounded-3xl shadow-2xl p-6 relative scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        
        {/* Kapat Butonu */}
        <button 
          onClick={onCancel} 
          className="absolute top-4 right-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"
        >
          <X size={18} />
        </button>

        {/* İkon ve Başlık */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600 dark:text-red-500" size={32} />
          </div>
          
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
            {title || "Emin misin?"}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 px-2">
            {message || "Bu işlem geri alınamaz. Devam etmek istiyor musunuz?"}
          </p>
        </div>

        {/* Butonlar */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onCancel}
            disabled={loading}
            className="py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Vazgeç
          </button>
          
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Evet, Sil'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;