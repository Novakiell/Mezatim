import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl ${className}`} />
);

const AuctionDetailSkeleton = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <Skeleton className="w-32 h-6 mb-6" /> {/* Geri Dön */}
      
      <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] border border-gray-200 dark:border-gray-700 overflow-hidden p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Skeleton className="aspect-[4/5] w-full rounded-[2.5rem]" />
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-xl" />)}
            </div>
          </div>
          {/* Orta */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Skeleton className="w-40 h-12" /> {/* Sayaç */}
            <div className="flex gap-4 items-center">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-3/4 h-10" /> {/* Başlık */}
            <Skeleton className="w-full h-32" /> {/* Açıklama */}
            <Skeleton className="w-full h-40" /> {/* Fiyat */}
          </div>
          {/* Sağ */}
          <div className="lg:col-span-4">
             <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailSkeleton;