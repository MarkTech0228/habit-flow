import React from 'react';


interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'circle' | 'button' | 'list';
  count?: number;
  className?: string;
}


const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`h-4 bg-slate-200 dark:bg-slate-700 rounded skeleton ${className}`} />
        );
     
      case 'card':
        return (
          <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border-2 border-slate-200 dark:border-slate-700 ${className}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded skeleton w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded skeleton w-1/2" />
              </div>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg skeleton" />
            </div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl skeleton" />
          </div>
        );
     
      case 'circle':
        return (
          <div className={`w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full skeleton ${className}`} />
        );
     
      case 'button':
        return (
          <div className={`h-12 bg-slate-200 dark:bg-slate-700 rounded-xl skeleton ${className}`} />
        );
     
      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded skeleton w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded skeleton w-1/2" />
                </div>
                <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded skeleton" />
              </div>
            ))}
          </div>
        );
     
      default:
        return null;
    }
  };


  if (count === 1) {
    return renderSkeleton();
  }


  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-3">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};


export default SkeletonLoader;




