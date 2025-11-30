import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import AuctionCard from '../components/AuctionCard';
import CreateAuctionModal from '../components/CreateAuctionModal';
import Footer from '../components/Footer';
import AuctionCardSkeleton from '../components/AuctionCardSkeleton';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowDownCircle, ArrowUpDown } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [userFavorites, setUserFavorites] = useState([]);
  
  // YENİ: SIRALAMA STATE'İ
  const [sortBy, setSortBy] = useState("newest"); // newest, ending_soon, price_asc, price_desc, most_bids

  // Arama, Kategori VEYA SIRALAMA değişince her şeyi sıfırla
  useEffect(() => {
    setAuctions([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);
    fetchAuctions(0, true);
    if (user) fetchFavorites();
  }, [searchQuery, selectedCategory, sortBy, user]);

  const fetchFavorites = async () => {
    const { data } = await supabase.from('favorites').select('product_id').eq('user_id', user.id);
    if (data) setUserFavorites(data.map(fav => fav.product_id));
  };

  const calculateTimeLeft = (endTime) => {
    if (!endTime) return "Belirsiz";
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total <= 0) return "Sona Erdi";
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    if (days > 0) return `${days} Gün ${hours} Saat`;
    if (hours > 0) return `${hours} Saat ${minutes} Dk`;
    return `${minutes} Dk Kaldı`;
  };

  const fetchAuctions = async (pageNumber, reset = false) => {
    try {
      const now = new Date().toISOString();
      const from = pageNumber * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('products')
        .select('*, profiles(avatar_url, name, surname)', { count: 'exact' })
        .gt('end_time', now)
        .eq('status', 'active')
        .range(from, to);

      // --- SIRALAMA MANTIĞI ---
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'ending_soon':
          query = query.order('end_time', { ascending: true }); // En yakın tarih en üstte
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true }); // Ucuzdan pahalıya
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false }); // Pahalıdan ucuza
          break;
        case 'most_bids':
          query = query.order('bid_count', { ascending: false }); // En popüler
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Filtreler
      if (searchQuery && searchQuery.trim() !== '') {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      if (selectedCategory !== "Hepsi") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          desc: item.description,
          category: item.category || "Diğer",
          status: item.condition || "2. El",
          currentBid: item.price?.toLocaleString('tr-TR'),
          bidCount: item.bid_count,
          buyNowPrice: item.buy_now_price?.toLocaleString('tr-TR'),
          timeLeft: calculateTimeLeft(item.end_time),
          image: item.image_url,
          sellerName: item.profiles ? `${item.profiles.name} ${item.profiles.surname}` : item.seller_name,
          sellerAvatar: item.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${item.seller_id}`
        }));

        if (reset) {
          setAuctions(formattedData);
        } else {
          setAuctions(prev => [...prev, ...formattedData]);
        }

        if (data.length < ITEMS_PER_PAGE || (from + data.length) >= count) {
           setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Hata:', error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchAuctions(nextPage, false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] font-sans antialiased flex flex-col transition-colors duration-300">
      <Navbar />
      <Hero onOpenModal={() => setIsModalOpen(true)} />
      <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-20 flex-grow">
        
        {/* ÜST BAR: ARAMA SONUCU VE SIRALAMA */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            
            {/* Sol: Arama Sonucu veya Boşluk */}
            <div className="text-xl font-bold text-gray-800 dark:text-white">
                {searchQuery ? (
                    <>"{searchQuery}" için sonuçlar <button onClick={() => window.location.href='/'} className="text-sm text-indigo-500 hover:underline ml-2 font-normal">(Temizle)</button></>
                ) : (
                    <span>Günün Fırsatları 🔥</span>
                )}
            </div>

            {/* Sağ: Sıralama Menüsü */}
            <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-400" />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-indigo-500 cursor-pointer font-medium shadow-sm"
                >
                    <option value="newest">En Yeniler</option>
                    <option value="ending_soon">Süresi Bitenler ⏳</option>
                    <option value="most_bids">En Çok Teklif Alanlar 🔥</option>
                    <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                </select>
            </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <AuctionCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctions.length > 0 ? (
                auctions.map((item) => (
                  <AuctionCard 
                    key={item.id} 
                    data={item} 
                    isFavorite={userFavorites.includes(item.id)}
                    onToggleFavorite={() => {
                      if (userFavorites.includes(item.id)) setUserFavorites(prev => prev.filter(id => id !== item.id));
                      else setUserFavorites(prev => [...prev, item.id]);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400 text-lg">
                     {searchQuery ? `"${searchQuery}" bulunamadı.` : "Bu kategoride ürün yok."}
                  </p>
                  {(selectedCategory !== "Hepsi" || searchQuery) && (
                    <button onClick={() => { setSelectedCategory("Hepsi"); window.location.href='/'; }} className="mt-4 text-indigo-600 font-bold hover:underline cursor-pointer">Tümünü Gör</button>
                  )}
                </div>
              )}
            </div>

            {hasMore && auctions.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore} 
                  disabled={loadingMore}
                  className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  {loadingMore ? 'Yükleniyor...' : <><ArrowDownCircle size={20}/> Daha Fazla Göster</>}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      {isModalOpen && <CreateAuctionModal onClose={() => setIsModalOpen(false)} onSuccess={() => { setAuctions([]); setPage(0); fetchAuctions(0, true); }} />}
      <Footer />
    </div>
  );
};

export default Home;