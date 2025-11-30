import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const LeaveReviewModal = ({ product, user, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); // Mouse ile üzerine gelince yıldız parlasın
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Lütfen puan verin!");

    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        buyer_id: user.id,
        seller_id: product.seller_id, // Ürünün satıcısına yorum yapıyoruz
        product_id: product.id,
        rating: rating,
        comment: comment
      }]);

      if (error) throw error;

      // Ürünün durumunu güncelle (Tekrar yorum yapılmasın diye bir flag koyabiliriz ama şimdilik gerek yok)
      toast.success("Yorumunuz gönderildi! Teşekkürler 🌟");
      onSuccess();
      onClose();

    } catch (err) {
      toast.error("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-3xl shadow-2xl relative p-8 text-center">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <X size={20} className="dark:text-white" />
        </button>

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Nasıl Buldunuz?</h2>
        <p className="text-gray-500 text-sm mb-6">{product.title} deneyiminizi puanlayın.</p>

        <form onSubmit={handleSubmit}>
          {/* YILDIZLAR */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={32} 
                  className={`${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                />
              </button>
            ))}
          </div>

          {/* YORUM ALANI */}
          <textarea 
            rows="4" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deneyiminizi buraya yazın..."
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white mb-6"
          ></textarea>

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Yorumu Gönder'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LeaveReviewModal;