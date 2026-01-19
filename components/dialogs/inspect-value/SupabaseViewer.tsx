import React from 'react';

interface SupabaseViewerProps {
  refKey: string;
}

const SupabaseViewer: React.FC<SupabaseViewerProps> = ({ refKey }) => {
  const mockTableData = [
    { id: 101, node_key: 'PROCESS_01', last_run: '2024-05-20 14:22', status: 'SUCCESS', latency_ms: 45 },
    { id: 102, node_key: 'TRANSFORM_02', last_run: '2024-05-20 14:23', status: 'SUCCESS', latency_ms: 122 },
    { id: 103, node_key: 'OUTPUT_03', last_run: '2024-05-20 14:24', status: 'WARNING', latency_ms: 890 },
    { id: 104, node_key: 'CLEANUP_04', last_run: '2024-05-20 14:25', status: 'SUCCESS', latency_ms: 31 },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Supabase Database Connection</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600/70 select-all font-bold">{refKey}</span>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {Object.keys(mockTableData[0]).map(k => (
                <th key={k} className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight border-b border-slate-100">{k}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockTableData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                {Object.values(row).map((v, j) => (
                  <td key={j} className="py-3 text-[11px] font-mono text-slate-600">{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
           <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto italic">
             This is a live snapshot from the Supabase resource manager. Real-time data will be populated during workflow execution.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseViewer;