import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import LoadingState from './components/LoadingState';
import ApiKeyInput from './components/ApiKeyInput';
import { analyzeImageWithGemini } from './services/geminiService';
import { AppState, AnalysisResult } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Load API key from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
    handleReset();
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentResult(null);
    setErrorMsg(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!apiKey) return;

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    // Create a local object URL for preview immediately
    const objectUrl = URL.createObjectURL(file);

    try {
      // Call Gemini Service
      const description = await analyzeImageWithGemini(file, apiKey);

      const result: AnalysisResult = {
        id: uuidv4(),
        imageUrl: objectUrl,
        description: description,
        timestamp: Date.now(),
        fileName: file.name
      };

      setCurrentResult(result);
      setAppState(AppState.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during analysis.");
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header 
        onReset={handleReset} 
        apiKey={apiKey} 
        onClearKey={handleClearApiKey} 
      />

      <main className="flex-grow flex flex-col items-center justify-start p-6 md:p-12 w-full max-w-7xl mx-auto">
        
        {/* API Key Input Screen */}
        {!apiKey && (
          <div className="w-full flex-grow flex items-center justify-center">
            <ApiKeyInput onSetApiKey={handleSetApiKey} />
          </div>
        )}

        {/* Main App Content */}
        {apiKey && (
          <>
            {/* Introduction / Hero Text (Only show when idle) */}
            {appState === AppState.IDLE && (
              <div className="text-center mb-12 animate-fade-in-down">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                  See what AI sees.
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Upload any image to generate a detailed, intelligent description using the power of Google Gemini Vision.
                </p>
              </div>
            )}

            {/* View Switching Logic */}
            <div className="w-full transition-all duration-500 ease-in-out">
              
              {appState === AppState.IDLE && (
                <ImageUploader 
                  onFileSelected={handleImageUpload} 
                  isLoading={false} 
                />
              )}

              {appState === AppState.ANALYZING && (
                <LoadingState />
              )}

              {appState === AppState.ERROR && (
                <div className="max-w-md mx-auto text-center">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Analysis Failed</h3>
                    <p className="text-slate-600 mb-6">{errorMsg}</p>
                    <button 
                      onClick={handleReset}
                      className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {appState === AppState.SUCCESS && currentResult && (
                <AnalysisView result={currentResult} />
              )}

            </div>
          </>
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Visionary AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;