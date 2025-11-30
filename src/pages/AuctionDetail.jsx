import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, Heart, ShieldCheck, Send, User, ChevronRight, MessageSquare, Loader2, Star } from 'lucide-react';
import PlaceBidModal from '../components/PlaceBidModal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

// EKLENTİLER (Artık hata vermeyecek)
import confetti from 'canvas-confetti';
import AuctionDetailSkeleton from '../components/AuctionDetailSkeleton';

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerRating, setSellerRating] = useState(null);
  
  const [buying, setBuying] = useState(false); 
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isBuyConfirmOpen, setIsBuyConfirmOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [timeLeft, setTimeLeft] = useState("Hesaplanıyor...");
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    fetchMessages();
    window.scrollTo(0, 0);

    const productChannel = supabase.channel('realtime-product').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${id}` }, (payload) => { setProduct((prev) => ({ ...prev, ...payload.new })); }).subscribe();
    const chatChannel = supabase.channel('realtime-messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `product_id=eq.${id}` }, (payload) => { setMessages((prev) => [...prev, payload.new]); scrollToBottom(); }).subscribe();

    return () => { supabase.removeChannel(productChannel); supabase.removeChannel(chatChannel); };
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(product.end_time).getTime();
      const distance = end - now;
      if (distance < 0) { setTimeLeft("SÜRE BİTTİ"); clearInterval(timer); } 
      else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(days === 0 ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${days} Gün ${hours} Saat`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [product]);

  const scrollToBottom = () => { setTimeout(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100); };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*, profiles(avatar_url, name, surname)').eq('id', id).single();
      if (error) throw error;
      setProduct(data);
      if (data.seller_id) { const { data: ratingData } = await supabase.rpc('get_seller_rating', { p_seller_id: data.seller_id }); setSellerRating(ratingData); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchMessages = async () => { try { const { data } = await supabase.from('messages').select('*').eq('product_id', id).order('created_at', { ascending: true }); setMessages(data || []); scrollToBottom(); } catch (error) { console.error(error); } };
  const sendMessage = async (e) => { e.preventDefault(); if (!newMessage.trim()) return; if (!user) return toast.error("Giriş yapmalısın!"); const username = user.email.split('@')[0]; await supabase.from('messages').insert([{ content: newMessage, product_id: id, user_id: user.id, username: username }]); setNewMessage(''); };

  const handleBuyClick = () => {
    if (!user) return toast.error("Satın almak için giriş yapmalısın!");
    if (user.id === product.seller_id) return toast.error("Kendi ürününü satın alamazsın!");
    setIsBuyConfirmOpen(true);
  };

  const confirmPurchase = async () => {
    setBuying(true);
    try {
      const { error } = await supabase.rpc('buy_product', { p_product_id: product.id, p_buyer_id: user.id });
      if (error) throw error;
      
      setIsBuyConfirmOpen(false);
      
      // KONFETİ PATLAT!
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2563EB', '#FF9F1C', '#10B981'] });
      toast.success("Tebrikler! Ürün senin. 🥳");
      setTimeout(() => { navigate('/dashboard'); }, 2000);
    } catch (err) { toast.error(err.message); } finally { setBuying(false); }
  };

  const handleOpenBidModal = () => { if (!user) return toast.error("Giriş yapmalısınız!"); setIsBidModalOpen(true); };

  // --- LOADING: SKELETON GÖSTER ---
  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] transition-colors duration-300">
      <Navbar />
      <AuctionDetailSkeleton />
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center dark:text-white">Ürün Bulunamadı</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] font-sans text-gray-800 dark:text-gray-200 pb-20 transition-colors duration-300">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 font-medium transition"><ChevronRight className="rotate-180" size={16}/> Mezatlara Dön</Link>
        
        <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-6 lg:p-8">
            <div className="lg:col-span-3 flex flex-col gap-4">
              
              {/* ETİKETLER DIŞARIDA */}
              <div className="flex justify-between items-center px-2">
                 <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm border border-gray-200 dark:border-gray-600 ${product.condition === 'Sıfır' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'}`}>{product.condition || '2. El'}</div>
                 <button className="p-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm active:scale-95 cursor-pointer"><Heart size={20} /></button>
              </div>

              {/* RESİM ÇERÇEVESİ - YUVARLAK & TEMİZ */}
              <div className="relative rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-inner p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/5] w-full h-full overflow-hidden rounded-[2rem] relative z-10">
                    <img src={Array.isArray(product.image_url) ? product.image_url[activeImage] : product.image_url} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Main" />
                </div>
              </div>

              {Array.isArray(product.image_url) && product.image_url.length > 1 && ( <div className="grid grid-cols-4 gap-3 mt-2 px-1">{product.image_url.map((img, index) => (<button key={index} onClick={() => setActiveImage(index)} className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${activeImage === index ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#1E293B] scale-95 shadow-md' : 'opacity-60 hover:opacity-100 hover:scale-105 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800'}`}><img src={img} className="w-full h-full object-cover" alt="thumb" /></button>))}</div> )}
            </div>
            
            <div className="lg:col-span-5 py-2 flex flex-col justify-between">
              <div>
                <div className={`flex items-center gap-2 font-black text-3xl mb-6 w-fit px-5 py-3 rounded-2xl ${timeLeft === 'SÜRE BİTTİ' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'}`}><Clock size={28} className={timeLeft !== 'SÜRE BİTTİ' ? 'animate-pulse' : ''} /> <span className="tabular-nums tracking-tight">{timeLeft}</span></div>
                <div className="flex items-center gap-3 mb-4"><Link to={`/seller/${product.seller_id}`} className="flex items-center gap-3 group cursor-pointer"><div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm group-hover:border-indigo-500 transition">{(product.profiles?.avatar_url || product.seller_avatar) ? <img src={product.profiles?.avatar_url || product.seller_avatar} className="w-full h-full object-cover" alt="Seller" /> : (product.profiles?.name?.charAt(0) || product.seller_name?.charAt(0) || <User/>)}</div><div className="flex flex-col"><span className="font-semibold text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{product.profiles ? `${product.profiles.name} ${product.profiles.surname}` : (product.seller_name || 'Satıcı')}</span>{sellerRating && sellerRating.count > 0 && (<div className="flex items-center gap-1 text-xs font-bold text-yellow-500"><Star size={12} className="fill-current"/> {sellerRating.average} <span className="text-gray-400 font-normal">({sellerRating.count})</span></div>)}</div></Link></div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{product.title}</h1>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 mb-8"><p className="text-xs font-bold text-gray-400 uppercase mb-2">Ürün Açıklaması</p><p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.description}</p></div>
                <div className="flex items-end justify-between mb-8 p-6 rounded-3xl border border-indigo-50 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10"><div><p className="text-xs text-indigo-400 font-bold uppercase mb-1">Güncel Teklif</p><p className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">₺{product.price.toLocaleString()}</p><p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Toplam {product.bid_count} teklif</p></div><div className="text-right"><p className="text-xs text-gray-400 font-medium mb-1">Hemen Al</p><p className="text-xl font-bold text-emerald-500">₺{product.buy_now_price?.toLocaleString()}</p></div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleOpenBidModal} className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95 cursor-pointer"><span className="transform rotate-45 mr-1">🔨</span> Teklif Ver</button>
                <button onClick={handleBuyClick} disabled={buying} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95 cursor-pointer disabled:opacity-50">{buying ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> Satın Al</>}</button>
              </div>
            </div>
            <div className="lg:col-span-4 h-[600px] lg:h-auto mt-8 lg:mt-0"><div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-[2.5rem] h-full flex flex-col relative overflow-hidden shadow-xl"><div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1E293B] z-10 sticky top-0"><h3 className="text-gray-800 dark:text-white font-bold flex items-center gap-2"><div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full"><MessageSquare size={16} className="text-green-600 dark:text-green-400"/></div>Canlı Sohbet</h3></div><div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 space-y-4 bg-gray-50/50 dark:bg-[#0F172A]/50">{messages.length === 0 && <p className="text-gray-400 text-center text-sm mt-10">Henüz mesaj yok. Sessizliği boz! 👋</p>}{messages.map((msg) => { const isMe = msg.user_id === user?.id; return (<div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-sm'}`}>{!isMe && <span className="text-[10px] text-indigo-500 dark:text-indigo-300 font-bold block mb-1 uppercase">{msg.username}</span>}{msg.content}</div><span className="text-[10px] text-gray-400 mt-1 mx-1">Az önce</span></div>) })} <div ref={chatEndRef} /></div><div className="p-4 bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-gray-700">{user ? (<form onSubmit={sendMessage} className="flex gap-3"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Bir şeyler yaz..." className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 text-sm rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition" /><button type="submit" className="bg-indigo-600 p-3 rounded-2xl text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none cursor-pointer"><Send size={20} /></button></form>) : (<div className="text-center p-2"><Link to="/login" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">Sohbet için Giriş Yap</Link></div>)}</div></div></div>
          </div>
        </div>
      </main>

      {isBidModalOpen && product && <PlaceBidModal product={product} user={user} onClose={() => setIsBidModalOpen(false)} onSuccess={() => {}} />}
      {isBuyConfirmOpen && <ConfirmModal title="Hemen Satın Al" message={`"${product.title}" ürününü ₺${product.buy_now_price.toLocaleString()} karşılığında satın almak istiyor musunuz?`} onConfirm={confirmPurchase} onCancel={() => setIsBuyConfirmOpen(false)} loading={buying} />}

    </div>
  );
};

export default AuctionDetail;