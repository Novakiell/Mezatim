import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, Moon, Sun, Wallet, Menu, X, Shield } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../supabase';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [balance, setBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // Admin kontrolü
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?q=${searchTerm}`);
      setIsMobileMenuOpen(false);
    } else {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Veri Çekme (Bakiye ve Adminlik)
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Hem bakiyeyi hem de admin olup olmadığını çekiyoruz
      const { data } = await supabase
        .from('profiles')
        .select('balance, is_admin')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setBalance(data.balance || 0);
        setIsAdmin(data.is_admin || false); // Admin mi?
      }
    };
    fetchData();

    // Bakiyeyi canlı dinle
    const channel = supabase
      .channel('navbar-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
        setBalance(payload.new.balance);
        // Adminlik durumu değişirse onu da güncelleyelim
        if (payload.new.is_admin !== undefined) setIsAdmin(payload.new.is_admin);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <nav className="bg-white dark:bg-[#1E293B] py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 cursor-pointer z-20">
            <div className="border-2 border-indigo-600 px-2 py-1">
               <h1 className="text-2xl md:text-3xl font-black text-indigo-700 dark:text-indigo-400 tracking-tighter uppercase leading-none transition-colors">
                 MEZATIM
               </h1>
            </div>
          </Link>

          {/* DESKTOP ARAMA */}
          <div className="hidden md:block flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mezatlar İçin Arama Yapın..." 
              className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-full py-2.5 pl-12 pr-12 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-sm"
            />
            <button onClick={handleSearch} className="absolute left-4 top-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* DESKTOP SAĞ MENÜ */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <>
                {/* Cüzdan */}
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 px-4 py-2 rounded-full mr-2">
                  <div className="p-1 bg-emerald-500 rounded-full text-white"><Wallet size={14} /></div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm tracking-tight">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* ADMIN BUTONU (Sadece Adminse görünür) */}
                {isAdmin && (
                  <Link to="/admin">
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer">
                      <Shield size={18} /> Panel
                    </button>
                  </Link>
                )}

                {/* Hesabım */}
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-200 dark:shadow-none transition-transform active:scale-95 cursor-pointer">
                    <User size={18} /> <span className="hidden lg:inline">Hesabım</span>
                  </button>
                </Link>
                <button onClick={handleLogout} className="p-2.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer border border-red-100 dark:border-transparent" title="Çıkış Yap"><LogOut size={20} /></button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-200 dark:shadow-none transition-transform active:scale-95 cursor-pointer">Giriş Yap</button>
              </Link>
            )}
          </div>

          {/* MOBİL HAMBURGER BUTONU */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400">
               {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-white p-2">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBİL MENÜ */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E293B] px-4 py-6 space-y-4 shadow-xl absolute w-full left-0 top-20 z-40">
          
          {/* Mobil Arama */}
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ara..." 
              className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 dark:text-white"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          {user ? (
            <>
              {/* Mobil Bakiye */}
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">Cüzdan Bakiyesi</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Mobil Admin Linki */}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-100 dark:border-purple-800">
                  <Shield size={20} /> Admin Paneli
                </Link>
              )}

              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium">
                <User size={20} /> Hesabım & Depom
              </Link>
              
              <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 font-medium text-left">
                <LogOut size={20} /> Çıkış Yap
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold shadow-lg">Giriş Yap</button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;