
import React from 'react';

interface CodePreviewProps {
  code: string;
  onClose: () => void;
}

const CodePreviewDialog: React.FC<CodePreviewProps> = ({ code, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-y-1">
            <h2 className="text-lg font-bold text-slate-800">Generated Go Temporal Workflow</h2>
            <p className="text-xs text-slate-500 ml-4">This code is ready for deployment</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Copy Code
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-slate-950 p-6">
          <pre className="text-sm font-mono text-blue-300">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodePreviewDialog;
