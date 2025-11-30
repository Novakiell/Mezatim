import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuctionCard from '../components/AuctionCard';
import { User, Calendar, Star, Package, Award, MapPin, MessageSquare } from 'lucide-react';

const SellerProfile = () => {
  const { id } = useParams(); // URL'den satıcı ID'sini al
  const [seller, setSeller] = useState(null);
  const [activeListings, setActiveListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalListings: 0, rating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); 

  useEffect(() => {
    fetchSellerData();
  }, [id]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      // 1. Profil Bilgisi
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (profileError) throw profileError;
      setSeller(profile);

      // 2. Aktif Mezatlar (Vitrin)
      const now = new Date().toISOString();
      const { data: listings } = await supabase
        .from('products')
        .select('*, profiles(avatar_url, name, surname)')
        .eq('seller_id', id)
        .eq('status', 'active')
        .gt('end_time', now)
        .order('created_at', { ascending: false });

      const formattedListings = listings.map(item => ({
        id: item.id,
        title: item.title,
        desc: item.description,
        category: item.category || "Genel",
        status: "Aktif",
        currentBid: item.price?.toLocaleString('tr-TR'),
        bidCount: item.bid_count,
        buyNowPrice: item.buy_now_price?.toLocaleString('tr-TR'),
        timeLeft: new Date(item.end_time) > new Date() ? Math.floor((new Date(item.end_time) - new Date()) / (1000 * 60 * 60 * 24)) + " Gün Kaldı" : "Sona Erdi",
        image: item.image_url,
        sellerName: item.profiles ? `${item.profiles.name} ${item.profiles.surname}` : item.seller_name,
        sellerAvatar: item.profiles?.avatar_url
      }));
      setActiveListings(formattedListings || []);

      // 3. Yorumlar (Detaylı liste için)
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, profiles:buyer_id(name, surname, avatar_url)')
        .eq('seller_id', id)
        .order('created_at', { ascending: false });
      
      setReviews(reviewData || []);

      // 4. İstatistikler (Ciro ve İlan Sayısı)
      const { count: salesCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', id).eq('status', 'purchased');
      const { count: totalCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', id);
      
      // 5. GÜNCELLEME: PUANI RPC İLE ÇEKİYORUZ (Kesin Sonuç)
      let avgRating = 0;
      let reviewCount = 0;
      
      const { data: ratingData, error: ratingError } = await supabase.rpc('get_seller_rating', { p_seller_id: id });
      
      if (!ratingError && ratingData) {
        avgRating = ratingData.average; // Veritabanından gelen ortalama
        reviewCount = ratingData.count; // Veritabanından gelen sayı
      }

      setStats({
        totalSales: salesCount || 0,
        totalListings: totalCount || 0,
        rating: Number(avgRating), // Sayıya çeviriyoruz ki yıldızlar çalışsın
        reviewCount: reviewCount
      });

    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] flex items-center justify-center"><p className="text-indigo-600 font-bold animate-pulse">Profil Yükleniyor...</p></div>;
  if (!seller) return <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] flex items-center justify-center"><p className="text-gray-500">Satıcı bulunamadı.</p></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] font-sans transition-colors duration-300 pb-20">
      <Navbar />

      {/* --- KAPAK VE PROFİL BAŞLIĞI --- */}
      <div className="relative bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 pb-8">
        
        {/* Kapak Fotoğrafı */}
        <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col md:flex-row items-end md:items-center gap-6">
            
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#1E293B] bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-lg flex items-center justify-center">
              {seller.avatar_url ? (
                <img src={seller.avatar_url} className="w-full h-full object-cover" alt="Seller" />
              ) : (
                <div className="text-4xl font-bold text-gray-400">{seller.name?.charAt(0)}</div>
              )}
            </div>

            {/* İsim ve Rozetler */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {seller.name} {seller.surname}
                {stats.rating >= 4.5 && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200 flex items-center gap-1"><Award size={12}/> Süper Satıcı</span>}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1"><MapPin size={14}/> {seller.city || 'Konum Yok'}</div>
                <div className="flex items-center gap-1"><Calendar size={14}/> Katılım: {new Date(seller.created_at || Date.now()).getFullYear()}</div>
              </div>
            </div>

            {/* İstatistik Kutuları */}
            <div className="flex gap-4 mb-2">
                <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Puan</p>
                    <p className="text-xl font-black text-indigo-600 flex items-center justify-center gap-1">
                        <Star size={16} className="fill-indigo-600"/> {stats.rating}
                    </p>
                </div>
                <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Satış</p>
                    <p className="text-xl font-black text-emerald-600">{stats.totalSales}</p>
                </div>
                 <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">İlan</p>
                    <p className="text-xl font-black text-gray-800 dark:text-white">{stats.totalListings}</p>
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- SEKMELER VE İÇERİK --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8">
           <button 
             onClick={() => setActiveTab('listings')}
             className={`pb-4 px-6 text-sm font-bold transition relative ${activeTab === 'listings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
           >
             Aktif Mezatlar ({activeListings.length})
             {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('reviews')}
             className={`pb-4 px-6 text-sm font-bold transition relative ${activeTab === 'reviews' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
           >
             Değerlendirmeler ({stats.reviewCount})
             {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
           </button>
        </div>

        {activeTab === 'listings' ? (
            activeListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeListings.map(item => <AuctionCard key={item.id} data={item} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <Package size={48} className="mx-auto text-gray-300 mb-4"/>
                    <p className="text-gray-500">Şu an aktif bir ilanı yok.</p>
                </div>
            )
        ) : (
            <div className="space-y-4 max-w-3xl">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                                    {review.profiles?.avatar_url ? <img src={review.profiles.avatar_url} className="w-full h-full object-cover"/> : <span className="font-bold text-gray-400">{review.profiles?.name?.charAt(0) || 'U'}</span>}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{review.profiles?.name} {review.profiles?.surname}</p>
                                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                )) : (
                    <div className="text-center py-20">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4"/>
                        <p className="text-gray-500">Henüz yorum yapılmamış.</p>
                    </div>
                )}
            </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default SellerProfile;