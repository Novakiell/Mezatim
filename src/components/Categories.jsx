import React from 'react';

const categories = ["Hepsi", "Saat", "Elektronik", "Sanat", "Koleksiyon", "Antika", "Tesbih", "Diğer"];

const Categories = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-[73px] z-40 transition-colors duration-300 bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide p-4">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat;
            
            return (
              <button 
                key={index}
                onClick={() => onSelectCategory(cat)}
                className={`
                  px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border
                  
                  ${isSelected
                    /* AKTİF DURUM: */
                    /* shadow-[0_0_10px_...] -> 20px yerine 10px yaptık. Daha sıkı, daha net bir parlama. */
                    ? 'bg-blue-600 text-white border-transparent shadow-[0_0_10px_rgba(37,99,235,0.5)] transform scale-105' 
                    
                    /* PASİF DURUM: */
                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;