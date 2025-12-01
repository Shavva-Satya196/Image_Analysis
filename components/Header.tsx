import React from 'react';
import { APP_NAME } from '../constants';

interface HeaderProps {
  onReset: () => void;
  apiKey: string | null;
  onClearKey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, apiKey, onClearKey }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onReset}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            V
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            {APP_NAME}
          </h1>
        </div>
        
        <nav className="flex items-center gap-4">
          {apiKey ? (
             <>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onReset(); }}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block"
              >
                New Analysis
              </a>
              <button 
                onClick={onClearKey}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                title="Change API Key"
              >
                Change Key
              </button>
             </>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Setup Required</span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;