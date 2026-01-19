import React from 'react';
import { WorkflowGlobal } from '../../../types/workflow';

interface SidebarProps {
  parameter: WorkflowGlobal;
}

const Sidebar: React.FC<SidebarProps> = ({ parameter }) => {
  const { redisKey, filePath, supabaseRef, sourceType, description } = parameter;
  
  return (
    <div className="w-80 border-r border-slate-100 bg-slate-50/30 p-10 flex flex-col space-y-12 overflow-y-auto shrink-0">
      <section>
        <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-6">Resource Context</label>
        <div className="space-y-6">
          {redisKey && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-300 uppercase block mb-2 tracking-tighter">Remote Redis Pointer</span>
              <code className="text-[13px] text-blue-600 font-bold break-all leading-tight">{redisKey}</code>
            </div>
          )}
          {filePath && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-300 uppercase block mb-2 tracking-tighter">OS File Location</span>
              <code className="text-[13px] text-slate-600 font-bold break-all leading-tight">{filePath}</code>
            </div>
          )}
          {supabaseRef && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-300 uppercase block mb-2 tracking-tighter">Supabase Pointer</span>
              <code className="text-[13px] text-emerald-600 font-bold break-all leading-tight">{supabaseRef}</code>
            </div>
          )}
          {sourceType === 'Literal' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-300 uppercase block mb-2 tracking-tighter">DSL Storage</span>
              <p className="text-[11px] text-slate-400 italic">This value is embedded directly in the workflow manifest.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-6">System Meta</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">Status</span>
            <span className={`text-[12px] font-black ${parameter.isEnabled ? 'text-emerald-500' : 'text-slate-300'}`}>
              {parameter.isEnabled ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">Encrypted</span>
            <span className={`text-[12px] font-black ${parameter.isSensitive ? 'text-orange-500' : 'text-slate-400'}`}>
              {parameter.isSensitive ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </section>

      <section className="flex-1">
        <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-6">Documentation</label>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[13px] text-slate-500 leading-relaxed italic">
            {description || "No specific documentation provided for this resource configuration."}
          </p>
        </div>
      </section>

      <div className="pt-8 border-t border-slate-200 flex items-center justify-between opacity-30">
        <span className="text-[11px] font-black text-slate-400 uppercase">Temp-V2 Engine</span>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
      </div>
    </div>
  );
};

export default Sidebar;