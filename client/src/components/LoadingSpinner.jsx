import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-500/20 animate-ping"></div>
        <div className="w-14 h-14 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">Loading experience...</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-[70vh] flex items-center justify-center">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
