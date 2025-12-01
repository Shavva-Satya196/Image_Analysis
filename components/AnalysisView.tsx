import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  // Simple markdown-like parser to make the text look nicer
  const renderDescription = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      // Bullet points
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={i} className="ml-4 mb-1 text-slate-700 leading-relaxed">
            {line.trim().replace(/^[\*\-]\s/, '')}
          </li>
        );
      }
      // Bold text highlighting
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-3 text-slate-700 leading-relaxed">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Image Section */}
        <div className="lg:w-1/2 bg-slate-100 relative min-h-[400px] flex items-center justify-center p-6">
           <img 
             src={result.imageUrl} 
             alt="Analyzed content" 
             className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-lg object-contain"
           />
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col h-full max-h-[80vh] overflow-y-auto">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Result</h2>
            <p className="text-sm text-slate-500">
              Analyzed on {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="prose prose-slate max-w-none">
            {renderDescription(result.description)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisView;
