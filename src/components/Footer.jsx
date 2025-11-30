import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Kısım: Grid Yapısı */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Kolon: Marka ve Hakkında */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xl">M</div>
              <span className="text-2xl font-black tracking-tight">MEZATIM</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Türkiye'nin en güvenilir online açık artırma platformu. 
              Eşsiz parçaları keşfedin, teklif verin ve koleksiyonunuza değer katın.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* 2. Kolon: Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-bold mb-6">Hızlı Erişim</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/createauction" className="hover:text-indigo-400 transition-colors">Mezat Başlat</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Giriş Yap / Kayıt Ol</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Nasıl Çalışır?</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* 3. Kolon: Kategoriler */}
          <div>
            <h3 className="text-lg font-bold mb-6">Popüler Kategoriler</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Antika Saatler</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Koleksiyonluk Tesbihler</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Eski Paralar & Pullar</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Retro Elektronik</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Sanat Eserleri</a></li>
            </ul>
          </div>

          {/* 4. Kolon: Bülten ve İletişim */}
          <div>
            <h3 className="text-lg font-bold mb-6">Bültene Abone Ol</h3>
            <p className="text-gray-400 text-sm mb-4">Yeni mezatlardan ilk senin haberin olsun.</p>
            
            <form className="flex flex-col gap-3 mb-8">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Email adresiniz" 
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-900/20">
                Abone Ol
              </button>
            </form>

            <div className="space-y-2 text-sm text-gray-400">
               <div className="flex items-center gap-2"><MapPin size={16} className="text-indigo-500"/> İstanbul, Türkiye</div>
               <div className="flex items-center gap-2"><Phone size={16} className="text-indigo-500"/> +90 (212) 555 00 00</div>
            </div>
          </div>

        </div>

        {/* Alt Çizgi ve Telif */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 Mezatım A.Ş. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/gn.arda" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-white transition-colors">KVKK</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Sosyal Medya İkonu için minik bileşen
const SocialIcon = ({ icon }) => (
  <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300">
    {icon}
  </a>
);

export default Footer;