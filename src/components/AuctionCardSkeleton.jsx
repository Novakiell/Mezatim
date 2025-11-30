import React from 'react';
import Skeleton from './Skeleton';

const AuctionCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
      
      {/* Resim Alanı */}
      <Skeleton className="h-56 w-full rounded-2xl mb-4" />

      {/* İçerik */}
      <div className="px-2">
        {/* Başlık */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        {/* Açıklama (2 satır) */}
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-1/2 mb-4" />

        {/* Fiyatlar */}
        <div className="flex justify-between items-end mb-4">
          <div className="w-1/3">
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="w-1/3 flex flex-col items-end">
             <Skeleton className="h-3 w-full mb-1" />
             <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Sayaç */}
        <Skeleton className="h-8 w-32 mb-4 rounded-lg" />

        {/* Butonlar */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default AuctionCardSkeleton;