import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, Package, MessageSquare, Settings, Search, LogOut, Camera, Plus, Trash2, Archive, Send, User, Edit, RefreshCw, Lock, Bell, AlertTriangle, KeyRound, Heart, ExternalLink, Wallet, CreditCard, ArrowUpRight, Star, Gavel, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Modallar
import CreateAuctionModal from '../components/CreateAuctionModal';
import PublishModal from '../components/PublishModal';
import LeaveReviewModal from '../components/LeaveReviewModal';
import ConfirmModal from '../components/ConfirmModal';

// --- BİLDİRİM PANELİ BİLEŞENİ ---
const NotificationsPanel = ({ notifications, onClose, onRead }) => {
  return (
    <div className="absolute left-20 top-20 w-80 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[100] overflow-hidden animate-in slide-in-from-left-5 duration-200">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 dark:text-white">Bildirimler</h3>
        <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-red-500"/></button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 text-sm p-6">Yeni bildirim yok.</p>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              onClick={() => onRead(notif)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800 transition"
            >
              <div className="flex items-start gap-3">
                 <div className="mt-1 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                 <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{notif.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- BÖLÜM 1: PROFİL AYARLARI ---
const ProfileTab = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: '', surname: '', email: '', gender: '', city: '', birth_date: '', message_option: '', avatar_url: ''
  });
  const currentDate = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error) throw error;
        if (data) setProfile({ ...data, gender: data.gender || 'Seçiniz', city: data.city || 'Seçiniz', message_option: data.message_option || 'Herkese Açık', avatar_url: data.avatar_url || '' });
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    try {
      const { error } = await supabase.from('profiles').update(profile).eq('id', user.id);
      if (error) throw error;
      toast.success("Profil güncellendi! ✅");
    } catch (error) { toast.error(error.message); }
  };

  const handleChange = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('auction-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('auction-images').getPublicUrl(filePath);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Fotoğraf güncellendi! 📸");
    } catch (error) { toast.error(error.message); } finally { setUploading(false); }
  };

  if (loading) return <div className="text-center py-20 text-indigo-500 animate-pulse">Profil Yükleniyor...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hoşgeldin, {profile.name}</h1><p className="text-sm text-gray-400 capitalize">{currentDate}</p></div>
        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">{profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">{profile.name.charAt(0)}</div>}</div></div>
      </header>
      <div className="relative">
        <div className="h-72 rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 w-full shadow-lg shadow-indigo-200/50 dark:shadow-none"></div>
        <div className="absolute bottom-6 left-8 flex flex-col md:flex-row items-end justify-between w-[calc(100%-4rem)] z-10">
          <div className="flex items-end gap-6"><div className="relative group"><div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">{profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-white">{profile.name.charAt(0)}{profile.surname.charAt(0)}</div>}</div><label className="absolute bottom-2 right-2 bg-gray-900 text-white p-2.5 rounded-full hover:bg-indigo-600 transition cursor-pointer shadow-lg"><Camera size={16} /><input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} /></label></div><div className="mb-4"><h2 className="text-2xl font-bold text-white drop-shadow-sm">{profile.name} {profile.surname}</h2><p className="text-white/80">{profile.email}</p></div></div>
          <button onClick={updateProfile} className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-indigo-50 transition mb-4 active:scale-95 cursor-pointer">Veritabanına Kaydet</button>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2"><label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Adınız</label><input name="name" value={profile.name || ''} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-800 dark:text-gray-200" /></div>
          <div className="space-y-2"><label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Soyadınız</label><input name="surname" value={profile.surname || ''} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-800 dark:text-gray-200" /></div>
          <div className="space-y-2"><label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Şehir</label><input name="city" value={profile.city || ''} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-800 dark:text-gray-200" /></div>
          <div className="space-y-2"><label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Doğum Tarihi</label><input name="birth_date" value={profile.birth_date || ''} onChange={handleChange} type="date" className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-800 dark:text-gray-200" /></div>
        </div>
      </div>
    </div>
  );
};

// --- BÖLÜM 2: CÜZDAN TABI ---
const WalletTab = ({ user }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchWalletData(); }, [user]);

  const fetchWalletData = async () => {
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
    if (profile) setBalance(profile.balance || 0);
    const { data: tx } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setTransactions(tx || []);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (amount < 10) return toast.error("En az 10 TL yükleyebilirsiniz.");
    setLoading(true);
    setTimeout(async () => {
      try {
        const newBalance = Number(balance) + Number(amount);
        await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
        await supabase.from('transactions').insert([{ user_id: user.id, amount: Number(amount), type: 'deposit', description: 'Kredi Kartı ile Yükleme' }]);
        toast.success(`₺${amount} başarıyla yüklendi! 💸`); setAmount(''); fetchWalletData();
      } catch (err) { toast.error("İşlem başarısız."); } finally { setLoading(false); }
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600"><Wallet size={28}/></div>Cüzdanım</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div><p className="text-indigo-100 font-medium mb-1">Toplam Bakiye</p><h2 className="text-5xl font-black mb-8">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</h2><div className="flex gap-4"><div className="flex flex-col"><span className="text-xs text-indigo-200 uppercase font-bold">Kart Sahibi</span><span className="font-medium tracking-wide">KULLANICI</span></div><div className="flex flex-col ml-auto text-right"><span className="text-xs text-indigo-200 uppercase font-bold">Son Kullanma</span><span className="font-medium">12/28</span></div></div></div>
        <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><CreditCard size={20} className="text-indigo-600"/> Para Yükle</h3><form onSubmit={handleDeposit} className="space-y-4"><div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Yüklenecek Tutar</label><div className="relative mt-2"><span className="absolute left-4 top-3.5 text-gray-400 font-bold">₺</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-lg font-bold text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition" /></div></div><button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50">{loading ? 'İşleniyor...' : 'Güvenli Öde ve Yükle'}</button></form></div>
      </div>
      <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">İşlem Geçmişi</h3><div className="space-y-4">{transactions.length === 0 ? <p className="text-gray-400 text-center py-4">Henüz bir işlem yok.</p> : transactions.map(tx => (<div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"><div className="flex items-center gap-4"><div className={`p-3 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{tx.type === 'deposit' ? <ArrowUpRight size={20}/> : <Trash2 size={20}/>}</div><div><p className="font-bold text-gray-900 dark:text-white">{tx.description}</p><p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString('tr-TR')}</p></div></div><span className={`font-black text-lg ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'deposit' ? '+' : '-'}₺{tx.amount}</span></div>))}</div></div>
    </div>
  );
};

// --- BÖLÜM 3: TEKLİFLERİM TABI ---
const MyBidsTab = ({ user }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBids = async () => {
      setLoading(true);
      const { data: myBids, error } = await supabase.from('bids').select('product_id, products(*)').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) { console.error(error); } 
      else {
        const uniqueProducts = [];
        const map = new Map();
        for (const item of myBids) { if(!map.has(item.product_id)){ map.set(item.product_id, true); uniqueProducts.push(item.products); } }
        setBids(uniqueProducts);
      }
      setLoading(false);
    };
    fetchMyBids();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600"><Gavel size={28}/></div>Tekliflerim</h1></div>
      {loading ? <p className="text-center text-orange-500 font-bold animate-pulse">Teklifler Yükleniyor...</p> : bids.length === 0 ? <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-[2rem] border border-gray-100 dark:border-gray-700"><p className="text-gray-400">Henüz hiçbir mezata katılmadınız.</p><button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold hover:underline">Mezatları Keşfet</button></div> : (
        <div className="grid grid-cols-1 gap-4">
          {bids.map(product => {
            const isWinning = product.last_bidder_id === user.id;
            const isEnded = new Date(product.end_time) < new Date();
            const isWon = isEnded && isWinning;
            return (
              <div key={product.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition">
                <img src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url} className="w-24 h-24 object-cover rounded-xl bg-gray-100" alt={product.title}/>
                <div className="flex-1 w-full text-center md:text-left"><h3 className="font-bold text-gray-900 dark:text-white text-lg">{product.title}</h3><p className="text-sm text-gray-500">Şu Anki Fiyat: <span className="font-black text-indigo-600 dark:text-indigo-400">₺{product.price.toLocaleString()}</span></p><div className="mt-2">{isWon ? (<span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200">🏆 KAZANDIN</span>) : isEnded ? (<span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg">⛔ Sona Erdi</span>) : isWinning ? (<span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 animate-pulse">🟢 Kazanıyorsun</span>) : (<span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">🔴 Geçildin</span>)}</div></div>
                <div className="w-full md:w-auto">{!isEnded && !isWinning && (<Link to={`/auction/${product.id}`}><button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition active:scale-95">Hemen Artır 🔨</button></Link>)}{(isWinning || isEnded) && (<Link to={`/auction/${product.id}`}><button className="w-full md:w-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-xl font-bold transition hover:bg-gray-200 dark:hover:bg-gray-600">Detaya Git</button></Link>)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- BÖLÜM 4: DEPO TABI ---
const InventoryTab = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [publishItem, setPublishItem] = useState(null);
  const [reviewItem, setReviewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('seller_id', user.id).in('status', ['draft', 'purchased', 'active']).order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, [user]);

  const handleDeleteConfirm = async () => { if (!deleteItem) return; setDeleting(true); try { const { error } = await supabase.from('products').delete().eq('id', deleteItem.id); if (error) throw error; toast.success("Ürün silindi 👋"); fetchInventory(); setDeleteItem(null); } catch (err) { toast.error(err.message); } finally { setDeleting(false); } };
  const toggleTrade = async (item) => { try { const { error } = await supabase.from('products').update({ is_tradable: !item.is_tradable }).eq('id', item.id); if (error) throw error; toast.success(item.is_tradable ? "Takasa Kapatıldı" : "Takasa Açıldı"); fetchInventory(); } catch (err) { toast.error(err.message); } };
  const handleEdit = (item) => { setEditingItem(item); setIsCreateModalOpen(true); };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600"><Archive size={28}/></div>Depom</h1><button onClick={() => { setEditingItem(null); setIsCreateModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg dark:shadow-none cursor-pointer"><Plus size={20}/> Yeni Ekle</button></div>
      {loading ? <p className="text-center text-indigo-500 font-bold animate-pulse">Depo Yükleniyor...</p> : items.length === 0 ? <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-[2rem] border border-gray-100 dark:border-gray-700"><p className="text-gray-400">Deponuz boş.</p></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => {
                  const isPurchasedByMe = item.buyer_id === user.id && item.status === 'purchased';
                  return (
                    <div key={item.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col shadow-sm hover:shadow-md transition group">
                        <div className="flex gap-4 items-center mb-4"><img src={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url} className="w-24 h-24 object-cover rounded-2xl bg-gray-100 dark:bg-gray-700" alt=""/><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>{isPurchasedByMe ? (<div className="mt-1"><span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-200 block w-fit">Satın Aldım ✅</span><p className="text-[10px] text-gray-400 mt-1">{new Date(item.purchase_date).toLocaleDateString()} • Hemen Al</p></div>) : (<><p className="text-sm text-gray-500 mb-2">Başlangıç: <span className="font-bold text-indigo-600">₺{item.price}</span></p><button onClick={() => toggleTrade(item)} className={`text-xs px-2 py-1 rounded-lg border font-bold flex items-center gap-1 transition cursor-pointer ${item.is_tradable ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-gray-800 dark:border-gray-600'}`}><RefreshCw size={12} /> {item.is_tradable ? 'Takasa Açık' : 'Takas Kapalı'}</button></>)}</div></div>
                        <div className="flex gap-2">
                          {item.status === 'draft' && (<button onClick={() => handleEdit(item)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2"><Edit size={16} /> Düzenle</button>)}
                          <button onClick={() => setDeleteItem(item)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition cursor-pointer ml-auto"><Trash2 size={18} /></button>
                          {isPurchasedByMe && (<button onClick={() => setReviewItem(item)} className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2"><Star size={16} className="fill-yellow-700"/> Yorum Yap</button>)}
                        </div>
                        {item.status === 'draft' && (<button onClick={() => setPublishItem(item)} className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl transition w-full shadow-lg dark:shadow-none cursor-pointer active:scale-95">MEZATA ÇIKAR 🚀</button>)}
                    </div>
                  );
              })}
          </div>
      )}
      {isCreateModalOpen && <CreateAuctionModal onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchInventory} onlyDraft={true} initialData={editingItem} />}
      {publishItem && <PublishModal product={publishItem} onClose={() => setPublishItem(null)} onSuccess={fetchInventory} />}
      {reviewItem && <LeaveReviewModal product={reviewItem} user={user} onClose={() => setReviewItem(null)} onSuccess={() => {}} />}
      {deleteItem && <ConfirmModal title="Ürünü Sil" message={`"${deleteItem.title}" ürününü silmek istediğine emin misin? Geri alınamaz.`} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteItem(null)} loading={deleting} />}
    </div>
  );
};

// --- BÖLÜM 5: FAVORİLERİM TABI ---
const FavoritesTab = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchFavorites = async () => { setLoading(true); const { data } = await supabase.from('favorites').select('*, products(*)').eq('user_id', user.id); setFavorites(data ? data.map(fav => ({ ...fav.products, favoriteId: fav.id })) : []); setLoading(false); };
  useEffect(() => { fetchFavorites(); }, [user]);
  const removeFavorite = async (id) => { await supabase.from('favorites').delete().eq('id', id); toast.success("Kaldırıldı"); setFavorites(prev => prev.filter(item => item.favoriteId !== id)); };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600"><Heart size={28}/></div>Favorilerim</h1></div>
      {loading ? <p className="text-center text-red-500 font-bold animate-pulse">Yükleniyor...</p> : favorites.length === 0 ? <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-[2rem] border border-gray-100 dark:border-gray-700"><p className="text-gray-400">Henüz favori ürününüz yok.</p></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(item => (
                  <div key={item.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col shadow-sm hover:shadow-md transition"><div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gray-50 dark:bg-gray-800"><img src={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url} className="w-full h-full object-cover" alt={item.title} /><button onClick={() => removeFavorite(item.favoriteId)} className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-full text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"><Trash2 size={16} /></button></div><h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3><p className="text-sm text-gray-500 mb-4">Son Fiyat: <span className="font-bold text-indigo-600">₺{item.price}</span></p><Link to={`/auction/${item.id}`} className="mt-auto bg-gray-100 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white dark:text-gray-200 dark:hover:text-white text-gray-800 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"><ExternalLink size={16} /> Ürüne Git</Link></div>
              ))}
          </div>
      )}
    </div>
  );
};

// --- BÖLÜM 6: MESAJLAR (DM) TABI ---
const MessagesTab = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  useEffect(() => { const fetchContacts = async () => { const { data } = await supabase.from('profiles').select('id, name, surname, email').neq('id', user.id); setContacts(data || []); }; fetchContacts(); }, [user]);
  useEffect(() => { if (!selectedContact) return; const fetchMessages = async () => { const { data } = await supabase.from('direct_messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: true }); const filtered = data.filter(msg => (msg.sender_id === user.id && msg.receiver_id === selectedContact.id) || (msg.sender_id === selectedContact.id && msg.receiver_id === user.id)); setMessages(filtered); scrollToBottom(); }; fetchMessages(); const channel = supabase.channel('dm-channel').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => { const msg = payload.new; if ((msg.sender_id === user.id && msg.receiver_id === selectedContact.id) || (msg.sender_id === selectedContact.id && msg.receiver_id === user.id)) { setMessages(prev => [...prev, msg]); scrollToBottom(); } }).subscribe(); return () => supabase.removeChannel(channel); }, [selectedContact, user]);
  const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
  const sendMessage = async (e) => { e.preventDefault(); if (!newMessage.trim() || !selectedContact) return; await supabase.from('direct_messages').insert([{ content: newMessage, sender_id: user.id, receiver_id: selectedContact.id }]); setNewMessage(''); };
  return (
    <div className="h-[calc(100vh-100px)] flex gap-6"><div className="w-1/3 bg-white dark:bg-[#1E293B] rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col shadow-sm"><div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Mesajlar</h2></div><div className="flex-1 overflow-y-auto p-2 space-y-2">{contacts.map(contact => (<div key={contact.id} onClick={() => setSelectedContact(contact)} className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition ${selectedContact?.id === contact.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}><div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold">{contact.name?.charAt(0) || <User size={18}/>}</div><div className="flex-1 min-w-0"><p className="font-bold text-gray-800 dark:text-gray-200 truncate">{contact.name} {contact.surname}</p><p className="text-xs text-gray-400 truncate">{contact.email}</p></div></div>))}</div></div><div className="flex-1 bg-white dark:bg-[#1E293B] rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col shadow-sm">{selectedContact ? (<><div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">{selectedContact.name?.charAt(0)}</div><h3 className="font-bold text-gray-900 dark:text-white">{selectedContact.name} {selectedContact.surname}</h3></div><div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-[#0F172A]/50">{messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">Henüz mesaj yok. Merhaba de! 👋</p>}{messages.map(msg => { const isMe = msg.sender_id === user.id; return (<div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none shadow-sm'}`}>{msg.content}</div></div>); })}<div ref={chatEndRef} /></div><form onSubmit={sendMessage} className="p-4 bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-gray-700 flex gap-3"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesaj yaz..." className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition" /><button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg shadow-indigo-200 dark:shadow-none"><Send size={20} /></button></form></>) : (<div className="flex-1 flex flex-col items-center justify-center text-gray-400"><MessageSquare size={48} className="mb-4 opacity-20" /><p>Bir kişi seç ve sohbete başla.</p></div>)}</div></div>
  );
};

// --- BÖLÜM 7: AYARLAR TABI ---
const SettingsTab = () => {
  const { user } = useAuth(); const [oldPassword, setOldPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [loading, setLoading] = useState(false);
  const handlePasswordChange = async (e) => { e.preventDefault(); if (newPassword.length < 6) return toast.error("Kısa."); if (!oldPassword) return toast.error("Mevcut şifre?"); setLoading(true); try { const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword }); if (signInError) throw new Error("Yanlış şifre!"); const { error: updateError } = await supabase.auth.updateUser({ password: newPassword }); if (updateError) throw updateError; toast.success("Şifre değişti!"); setOldPassword(''); setNewPassword(''); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300"><Settings size={28} /></div><h1 className="text-3xl font-black text-gray-900 dark:text-white">Hesap Ayarları</h1></div>
      <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Lock size={20} className="text-indigo-600" /> Güvenlik</h3><form onSubmit={handlePasswordChange} className="space-y-4"><div><label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Mevcut Şifre</label><div className="relative"><KeyRound className="absolute left-3 top-3 text-gray-400" size={18} /><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Mevcut şifreniz" className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition" /></div></div><div><label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Yeni Şifre</label><div className="relative"><Lock className="absolute left-3 top-3 text-gray-400" size={18} /><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni şifreniz (En az 6 karakter)" className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition" /></div></div><button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50">{loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</button></form></div>
      <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><Bell size={20} className="text-orange-500" /> Bildirim Tercihleri</h3><div className="space-y-4"><div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl"><div><p className="font-bold text-gray-800 dark:text-white">Yeni Teklif Bildirimleri</p><p className="text-xs text-gray-500">Ürününüze teklif gelince haber ver.</p></div><div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div></div><div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl"><div><p className="font-bold text-gray-800 dark:text-white">Mezat Bitiş Uyarıları</p><p className="text-xs text-gray-500">Takip ettiğin mezat bitmek üzereyken uyar.</p></div><div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div></div></div></div></div>
      <div className="bg-red-50 dark:bg-red-900/10 rounded-[2rem] p-8 border border-red-100 dark:border-red-900/30"><h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Tehlikeli Bölge</h3><p className="text-sm text-red-500/80 mb-6">Hesabını silmek geri alınamaz.</p><button onClick={() => toast.error("Bu özellik şu an devre dışı.")} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 cursor-pointer">Hesabımı Sil</button></div>
    </div>
  );
};

// --- ANA BİLEŞEN: DASHBOARD ---
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [notifications, setNotifications] = useState([]); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => { await signOut(); navigate('/'); };

  // Bildirimleri Çek ve Dinle
  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
        const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        setNotifications(data || []);
        setUnreadCount(data?.length || 0);
    };
    fetchNotifs();

    const channel = supabase.channel('dashboard-notifs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast('Yeni Bildirim! 🔔');
    }).subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleNotificationClick = async (notif) => {
     await supabase.from('notifications').delete().eq('id', notif.id);
     setNotifications(prev => prev.filter(n => n.id !== notif.id));
     setUnreadCount(prev => Math.max(0, prev - 1));
     setShowNotifications(false);
     if(notif.link) navigate(notif.link);
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] dark:bg-[#0F172A] font-sans transition-colors duration-300">
      <aside className="w-20 bg-white dark:bg-[#1E293B] flex flex-col items-center py-8 border-r border-gray-200 dark:border-gray-800 fixed h-full z-10 left-0 top-0 transition-colors duration-300">
        <Link to="/" className="bg-indigo-600 p-2 rounded-lg mb-10 shadow-lg shadow-indigo-200 dark:shadow-none cursor-pointer"><LayoutGrid className="text-white w-6 h-6" /></Link>
        <nav className="flex flex-col gap-5 flex-1 w-full items-center">
          <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'profile' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<LayoutGrid size={24} /></button>
          
          {/* BİLDİRİM BUTONU */}
          <div className="relative">
             <button onClick={() => setShowNotifications(!showNotifications)} className={`p-3 rounded-xl transition-all relative group text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}>
               <Bell size={24} />
               {unreadCount > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#1E293B]"></span>}
             </button>
             {/* BİLDİRİM DROPDOWN */}
             {showNotifications && (
                <div className="absolute left-16 top-0 w-72 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-left">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white">Bildirimler</div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? <p className="text-center text-gray-400 text-sm p-4">Temiz!</p> : notifications.map(n => (
                            <div key={n.id} onClick={() => handleNotificationClick(n)} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-50 dark:border-gray-800">
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{n.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(n.created_at).toLocaleTimeString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}
          </div>

          <button onClick={() => setActiveTab('wallet')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'wallet' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'wallet' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<Wallet size={24} /></button>
          <button onClick={() => setActiveTab('mybids')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'mybids' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'mybids' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<Gavel size={24} /></button>
          <button onClick={() => setActiveTab('inventory')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'inventory' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'inventory' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<Package size={24} /></button>
          <button onClick={() => setActiveTab('favorites')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'favorites' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'favorites' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<Heart size={24} /></button>
          <button onClick={() => setActiveTab('messages')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'messages' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'messages' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<MessageSquare size={24} /></button>
          <button onClick={() => setActiveTab('settings')} className={`p-3 rounded-xl transition-all relative group ${activeTab === 'settings' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{activeTab === 'settings' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full block"></div>}<Settings size={24} /></button>
        </nav>

        <button onClick={handleLogout} className="mt-auto p-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer mb-4"><LogOut size={24} /></button>
      </aside>

      <main className="flex-1 ml-20 p-4 md:p-8 overflow-hidden h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}><ProfileTab user={user} /></motion.div>
          )}
          {activeTab === 'wallet' && (
            <motion.div key="wallet" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}><WalletTab user={user} /></motion.div>
          )}
          {activeTab === 'mybids' && (
            <motion.div key="mybids" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}><MyBidsTab user={user} /></motion.div>
          )}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}><InventoryTab user={user} /></motion.div>
          )}
          {activeTab === 'favorites' && (
            <motion.div key="favorites" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}><FavoritesTab user={user} /></motion.div>
          )}
          {activeTab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}><MessagesTab user={user} /></motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}><SettingsTab /></motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;