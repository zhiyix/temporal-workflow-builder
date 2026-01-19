
import React, { useState, useMemo } from 'react';
import { WorkflowGlobal } from '../../types/workflow';
import JsonViewer from './inspect-value/JsonViewer';
import SmartPaginatedTable from './inspect-value/SmartPaginatedTable';
import SupabaseViewer from './inspect-value/SupabaseViewer';
import Sidebar from './inspect-value/Sidebar';

interface InspectValueDialogProps {
  parameter: WorkflowGlobal;
  onClose: () => void;
}

const InspectValueDialog: React.FC<InspectValueDialogProps> = ({ parameter, onClose }) => {
  const { sourceType, valueType, value, envVarName, supabaseRef, key, isSensitive } = parameter;
  const [viewMode, setViewMode] = useState<'Table' | 'JSON'>('Table');

  const parsedValue = useMemo(() => {
    if (valueType === 'Object' || valueType === 'Array' || valueType === 'ZSet') {
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    }
    return value;
  }, [value, valueType]);

  const renderContent = () => {
    if (sourceType === 'Supabase') {
      return <SupabaseViewer refKey={supabaseRef || 'system_ref'} />;
    }

    if (valueType === 'Array' || valueType === 'ZSet') {
      const dataArray = Array.isArray(parsedValue) ? parsedValue : [];
      if (viewMode === 'Table') {
        return <SmartPaginatedTable data={dataArray} type={valueType} />;
      }
      return (
        <div className="p-8 h-full overflow-auto bg-white">
          <JsonViewer data={parsedValue} />
        </div>
      );
    }

    if (sourceType === 'Env') {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-blue-200">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-[14px] font-bold text-slate-800 mb-2">Runtime Environment Mapping</h3>
          <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed mb-8">
            This parameter is dynamically injected from the environment at startup.
          </p>
          <div className="bg-white border-2 border-blue-600 px-8 py-4 rounded-2xl font-mono text-blue-700 text-[16px] font-black shadow-2xl">
            ${envVarName}
          </div>
          <div className="mt-16 w-32 h-[1px] bg-slate-200"></div>
          <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Injected via host runtime</p>
        </div>
      );
    }

    return (
      <div className="p-8 h-full overflow-auto bg-white">
        <div className="mb-6 flex items-center justify-between">
           <div className="flex items-center space-x-2">
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Literal Resource</span>
             {isSensitive && (
               <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">SECRET</span>
             )}
           </div>
        </div>
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner min-h-[300px]">
           <JsonViewer data={parsedValue} />
        </div>
      </div>
    );
  };

  const getSourceIcon = () => {
    switch (sourceType) {
      case 'Redis': return '⚡';
      case 'File': return '📄';
      case 'Env': return '💻';
      case 'Supabase': return '☁️';
      default: return '✏️';
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-[8px] p-6 md:p-12">
      <div className="bg-white w-[80%] h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in duration-300">
        <div className="h-16 bg-slate-900 flex items-center justify-between px-10 text-white shrink-0">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
              {getSourceIcon()}
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-black tracking-tighter uppercase leading-none mb-1.5">{key}</h2>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <span className="text-blue-500">{sourceType}</span>
                <span className="opacity-10 text-white">|</span>
                <span className="text-purple-500">{valueType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {(valueType === 'Array' || valueType === 'ZSet') && sourceType !== 'Supabase' && (
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setViewMode('Table')}
                  className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${viewMode === 'Table' ? 'bg-white text-slate-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Table
                </button>
                <button 
                  onClick={() => setViewMode('JSON')}
                  className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${viewMode === 'JSON' ? 'bg-white text-slate-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  JSON
                </button>
              </div>
            )}
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/20 text-white/30 hover:text-white transition-all border border-white/5"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <Sidebar parameter={parameter} />
          <div className="flex-1 relative bg-white overflow-hidden">
             {renderContent()}
          </div>
        </div>

        <div className="h-24 bg-slate-50 border-t border-slate-200 flex items-center justify-between px-12 shrink-0">
           <div className="flex items-center space-x-4 text-slate-400">
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center">
                 <svg className="w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black uppercase tracking-widest leading-none mb-1">Resource Integrity</span>
                <span className="text-[10px] font-bold opacity-60">Verified Snapshot visualization</span>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="px-14 py-4 bg-slate-950 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl hover:shadow-slate-300 active:scale-95"
           >
              Dismiss View
           </button>
        </div>
      </div>
    </div>
  );
};

export default InspectValueDialog;
