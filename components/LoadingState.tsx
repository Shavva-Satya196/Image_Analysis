import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto text-center p-12">
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        
        {/* Inner pulse */}
        <div className="absolute inset-0 m-auto w-10 h-10 bg-indigo-50 rounded-full animate-pulse"></div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Image</h3>
      <p className="text-slate-500">
        Our AI is examining the details of your image. This usually takes just a few seconds...
      </p>
    </div>
  );
};

export default LoadingState;
