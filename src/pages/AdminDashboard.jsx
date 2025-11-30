import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Users, DollarSign, Package, Trash2, ExternalLink, BarChart3, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalVolume: 0, activeAuctions: 0 });
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' veya 'users'

  // 1. Admin Kontrolü ve Veri Çekme
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (!user) return navigate('/login');

      // Admin mi?
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      
      if (!profile?.is_admin) {
        toast.error("Bu alana erişim yetkiniz yok! 🚫");
        return navigate('/');
      }

      // İstatistikleri Çek
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: auctionCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active');
      
      // Ciroyu hesapla (Basitçe transactions tablosundaki 'spend'leri toplayalım)
      // Not: Gerçek projede RPC ile yapılır ama şimdilik JS ile yapalım
      const { data: transactions } = await supabase.from('transactions').select('amount').eq('type', 'spend');
      const volume = transactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      setStats({ totalUsers: userCount, totalVolume: volume, activeAuctions: auctionCount });

      // Tüm Ürünleri Çek
      const { data: products } = await supabase.from('products').select('*, profiles(name, surname)').order('created_at', { ascending: false });
      setAllProducts(products || []);

      // Tüm Kullanıcıları Çek
      const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setAllUsers(users || []);

      setLoading(false);
    };

    checkAdminAndFetch();
  }, [user, navigate]);

  // Ürün Silme (Banlama)
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bu ilanı yayından kaldırmak istediğine emin misin Patron?")) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success("İlan başarıyla kaldırıldı 🗑️");
      setAllProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Hata: " + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white font-bold text-xl">Panel Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] font-sans text-gray-800 dark:text-gray-200">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-[#1E293B] text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg"><Shield size={24}/></div>
            <h1 className="text-xl font-black tracking-tight">MEZATIM ADMIN</h1>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <button onClick={() => setActiveTab('products')} className={`hover:text-indigo-400 transition ${activeTab === 'products' ? 'text-indigo-400' : 'text-gray-400'}`}>Ürün Yönetimi</button>
            <button onClick={() => setActiveTab('users')} className={`hover:text-indigo-400 transition ${activeTab === 'users' ? 'text-indigo-400' : 'text-gray-400'}`}>Kullanıcılar</button>
            <Link to="/" className="text-gray-400 hover:text-white border-l border-gray-700 pl-4">Siteye Dön</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- İSTATİSTİK KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Users size={32}/></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Toplam Üye</p>
              <p className="text-3xl font-black">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl"><DollarSign size={32}/></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Toplam Ciro</p>
              <p className="text-3xl font-black">₺{stats.totalVolume.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl"><Package size={32}/></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Aktif Mezat</p>
              <p className="text-3xl font-black">{stats.activeAuctions}</p>
            </div>
          </div>
        </div>

        {/* --- TABLO ALANI --- */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {activeTab === 'products' ? <Package className="text-indigo-500"/> : <Users className="text-indigo-500"/>}
              {activeTab === 'products' ? 'Tüm İlanlar' : 'Kayıtlı Kullanıcılar'}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4"/>
              <input type="text" placeholder="Listede ara..." className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500"/>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                <tr>
                  {activeTab === 'products' ? (
                    <>
                      <th className="px-6 py-4">Ürün</th>
                      <th className="px-6 py-4">Satıcı</th>
                      <th className="px-6 py-4">Fiyat</th>
                      <th className="px-6 py-4">Durum</th>
                      <th className="px-6 py-4 text-right">İşlem</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4">Kullanıcı</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Bakiye</th>
                      <th className="px-6 py-4">Şehir</th>
                      <th className="px-6 py-4 text-right">Yetki</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {activeTab === 'products' ? (
                  allProducts.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url} className="w-10 h-10 rounded-lg object-cover bg-gray-100"/>
                        <span className="font-medium truncate max-w-[200px]">{item.title}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.profiles?.name} {item.profiles?.surname}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">₺{item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'active' ? 'bg-green-100 text-green-700' : item.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Link to={`/auction/${item.id}`} target="_blank" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"><ExternalLink size={16}/></Link>
                        <button onClick={() => handleDeleteProduct(item.id)} className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4 font-medium">{u.name} {u.surname}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">₺{u.balance || 0}</td>
                      <td className="px-6 py-4 text-gray-500">{u.city || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        {u.is_admin ? <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-lg">ADMIN</span> : <span className="text-xs text-gray-400">Üye</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;