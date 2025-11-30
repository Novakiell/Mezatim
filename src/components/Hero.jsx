import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = ({ onOpenModal }) => {

  // --- GİRİŞ ANİMASYONLARI ---
  // Bu kapsayıcı, içindeki elemanları 0.1 saniye arayla tetikler
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, // Her eleman arası bekleme süresi
        delayChildren: 0.2 
      } 
    }
  };

  // Her bir satırın aşağıdan yukarı gelme efekti
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] } // Apple tarzı yumuşak duruş
    }
  };

  // --- SAĞ TARAF (KART) ANİMASYONU ---
  const floatVariants = {
    animate: { y: [0, -15, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
  };

  return (
    <div className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#0F172A]">
      
      {/* --- ARKA PLAN (PERFORMANS DOSTU - SABİT) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-[#0F172A] transition-colors duration-500"></div>
        
        {/* Renk Topları */}
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-purple-600/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* --- SOL TARAF: ANİMASYONLU YAZILAR --- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 text-center lg:text-left"
          >
            
            {/* 1. ETİKET */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/10 border border-indigo-100 dark:border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg mx-auto lg:mx-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-indigo-700 dark:text-white tracking-wider uppercase">Canlı Mezat Platformu</span>
            </motion.div>

            {/* 2. BAŞLIK */}
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1] drop-shadow-lg">
              HAYALİNDEKİ <br/>
              
              {/* SÜREKLİ ANİMASYONLU KISIM BURASI */}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 inline-block"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], // Renkler sağa sola akar
                }}
                transition={{ 
                  duration: 5, // 5 saniyede bir tur atar
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: "200% auto" }} // Gradyanı genişlettik ki aksın
              >
                FIRSATI YAKALA
              </motion.span>
            </motion.h1>

            {/* 3. AÇIKLAMA */}
            <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Binlerce koleksiyon parçası, antika ve teknolojik ürün seni bekliyor. Güvenli ödeme ve hızlı teslimat ile hemen teklif ver.
            </motion.p>

            {/* 4. BUTONLAR */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pb-2">
              <Link to="/register">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 group cursor-pointer">
                  Hemen Başla <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </Link>
              <button onClick={onOpenModal} className="bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-all duration-300 w-full sm:w-auto backdrop-blur-md cursor-pointer">
                Mezat Oluştur
              </button>
            </motion.div>

            {/* 5. ALT İKONLAR */}
            <motion.div variants={itemVariants} className="pt-4 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300"><ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20}/> Güvenli</div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300"><Zap className="text-yellow-500" size={20}/> Hızlı</div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300"><Globe className="text-emerald-600 dark:text-emerald-400" size={20}/> Global</div>
            </motion.div>
          </motion.div>

          {/* --- SAĞ TARAF: CAM KARTLAR (Sırayla Giriş Yapar) --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:block h-[500px]"
          >
            {/* Merkez Kart */}
            <motion.div 
              variants={floatVariants}
              animate="animate"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-center p-8 z-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/40">
                <Trophy className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Kazanan Sen Ol</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">En iyi teklifi ver, ürüne sahip ol.</p>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </motion.div>

            {/* Yan Kartçıklar */}
            <div className="absolute top-20 right-0 bg-white/80 dark:bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl z-10 border border-white/50 dark:border-white/10 flex items-center gap-3 animate-smooth-float-fast">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">✓</div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Son Teklif</p>
                    <p className="font-black text-gray-900 dark:text-white">₺15.400</p>
                </div>
            </div>

            <div className="absolute bottom-20 left-0 bg-white/80 dark:bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl z-10 border border-white/50 dark:border-white/10 flex items-center gap-3 animate-smooth-float-reverse">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">🔥</div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Popüler</p>
                    <p className="font-black text-gray-900 dark:text-white">+24 Teklif</p>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;