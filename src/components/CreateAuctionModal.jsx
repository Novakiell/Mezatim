import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { X, Loader2, UploadCloud, Archive } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ["Saat", "Elektronik", "Sanat", "Koleksiyon", "Antika", "Tesbih", "Diğer"];
const INCREMENTS = [50, 100, 200, 500, 1000];
const CONDITIONS = ["2. El", "Sıfır", "Yenilenmiş"];

const CreateAuctionModal = ({ onClose, onSuccess, onlyDraft = false, initialData = null }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [imageFiles, setImageFiles] = useState([]); 
  const [previews, setPreviews] = useState([]);     

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    buyNowPrice: '',
    category: 'Diğer',
    condition: '2. El',
    bidIncrement: '50',
    durationDays: '1',
    durationHours: '0'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        buyNowPrice: initialData.buy_now_price,
        category: initialData.category,
        condition: initialData.condition,
        bidIncrement: initialData.bid_increment,
        durationDays: '1',
        durationHours: '0'
      });
      if (initialData.image_url && Array.isArray(initialData.image_url)) {
        setPreviews(initialData.image_url);
      } else if (initialData.image_url) {
        setPreviews([initialData.image_url]);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (previews.length + files.length > 4) {
      return toast.error("En fazla 4 fotoğraf yükleyebilirsiniz!");
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    if (index >= (previews.length - imageFiles.length)) {
       const fileIndex = index - (previews.length - imageFiles.length);
       const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
       setImageFiles(newFiles);
    }
  };

  const triggerSubmit = async (mode) => {
    if (!user) return toast.error("Lütfen önce giriş yapın!");
    if (previews.length === 0) return toast.error("En az 1 fotoğraf olmalıdır!");

    if (mode === 'active') {
      const days = parseInt(formData.durationDays) || 0;
      const hours = parseInt(formData.durationHours) || 0;
      if (days === 0 && hours === 0) return toast.error("Mezat süresi en az 1 saat olmalıdır!");
    }

    setLoading(true);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        const { error } = await supabase.storage.from('auction-images').upload(filePath, file);
        if (error) throw error;
        const { data } = supabase.storage.from('auction-images').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const newUploadedUrls = await Promise.all(uploadPromises);
      const oldUrls = previews.filter(url => !url.startsWith('blob:'));
      const finalImageUrls = [...oldUrls, ...newUploadedUrls];

      // --- BURASI GÜNCELLENDİ: SATICI AVATARINI DA ALIYORUZ ---
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, surname, avatar_url') // avatar_url eklendi
        .eq('id', user.id)
        .single();
        
      const sellerName = profile ? `${profile.name} ${profile.surname}` : 'Bilinmeyen Satıcı';
      const sellerAvatar = profile ? profile.avatar_url : null; // Avatarı değişkene atadık
      
      let endDate = null;
      if (mode === 'active') {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + (parseInt(formData.durationDays) || 0));
        endDate.setHours(endDate.getHours() + (parseInt(formData.durationHours) || 0));
      }

      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        start_price: Number(formData.price),
        buy_now_price: Number(formData.buyNowPrice),
        bid_increment: Number(formData.bidIncrement),
        category: formData.category,
        condition: formData.condition,
        image_url: finalImageUrls,
        end_time: endDate ? endDate.toISOString() : null,
        seller_id: user.id,
        seller_name: sellerName,
        seller_avatar: sellerAvatar, // <--- VERİTABANINA KAYDEDİLİYOR
        status: mode
      };

      let error;
      if (initialData) {
        const { error: updateError } = await supabase.from('products').update(productData).eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert([productData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(initialData ? "Ürün Güncellendi! ✍️" : (mode === 'active' ? "Mezat Başladı! 🚀" : "Ürün Depoya Eklendi! 📦"));
      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {initialData ? 'Ürünü Düzenle ✏️' : (onlyDraft ? 'Depoya Ürün Ekle' : 'Mezat Başlat 🚀')}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-red-50 hover:text-red-600 transition cursor-pointer">
            <X size={20} className="dark:text-white" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Fotoğraflar ({previews.length}/4)</label>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {previews.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-800 transition">
                    <UploadCloud className="text-indigo-500" size={24} />
                    <span className="text-[10px] text-gray-500 mt-1 font-bold">Ekle</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                )}
                {previews.map((url, index) => (
                  <div key={index} className="aspect-square rounded-xl border border-gray-200 dark:border-gray-700 relative group overflow-hidden">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Ürün Başlığı</label><input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1" /></div>
              <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Kategori</label><select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1">{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
            </div>
            <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Ürün Durumu</label><select name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1">{CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}</select></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Başlangıç</label><input required name="price" value={formData.price} onChange={handleChange} type="number" className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1" /></div>
              <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Artış</label><select name="bidIncrement" value={formData.bidIncrement} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1">{INCREMENTS.map(inc => <option key={inc} value={inc}>+{inc} ₺</option>)}</select></div>
              <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Hemen Al</label><input required name="buyNowPrice" value={formData.buyNowPrice} onChange={handleChange} type="number" className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1" /></div>
            </div>
            {!onlyDraft && (
              <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Mezat Süresi</label><div className="grid grid-cols-2 gap-4 mt-1"><div className="relative"><input type="number" name="durationDays" min="0" value={formData.durationDays} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"/><span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium pointer-events-none">Gün</span></div><div className="relative"><input type="number" name="durationHours" min="0" max="23" value={formData.durationHours} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"/><span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium pointer-events-none">Saat</span></div></div></div>
            )}
            <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Açıklama</label><textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 mt-1"></textarea></div>
            <div className="pt-2">
              {onlyDraft ? (
                <button type="button" onClick={() => triggerSubmit('draft')} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">{loading ? <Loader2 className="animate-spin" size={20} /> : <><Archive size={20} /> {initialData ? 'Güncelle' : 'Depoya Ekle'}</>}</button>
              ) : (
                <div className="grid grid-cols-2 gap-4"><button type="button" onClick={() => triggerSubmit('draft')} disabled={loading} className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"><Archive size={20} /> Depoya Kaydet</button><button type="button" onClick={() => triggerSubmit('active')} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">{loading ? <Loader2 className="animate-spin" size={20} /> : 'Hemen Başlat 🚀'}</button></div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionModal;