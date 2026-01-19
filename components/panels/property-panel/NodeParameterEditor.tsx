
import React, { useState } from 'react';
import { NodeInstance, WorkflowGlobal } from '../../../types/workflow';
import ParameterDialog from '../../dialogs/ParameterDialog';
import InspectValueDialog from '../../dialogs/InspectValueDialog';

interface NodeParameterEditorProps {
  selectedNode: NodeInstance;
  direction: 'Input' | 'Output';
  onNodeUpdate: (nodeId: string, updates: Partial<NodeInstance>) => void;
}

const NodeParameterEditor: React.FC<NodeParameterEditorProps> = ({ selectedNode, direction, onNodeUpdate }) => {
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; data?: WorkflowGlobal }>({
    isOpen: false,
    mode: 'create'
  });
  
  const [inspectData, setInspectData] = useState<WorkflowGlobal | null>(null);

  const parameters = selectedNode.config.parameters || [];
  
  // Filtering logic: Simply match the direction now
  const filteredParams = parameters.filter(p => p.paramDirection === direction);

  const handleSave = (data: WorkflowGlobal) => {
    let nextParams: WorkflowGlobal[];
    if (dialogState.mode === 'create') {
      nextParams = [...parameters, data];
    } else {
      nextParams = parameters.map(p => p.id === data.id ? data : p);
    }
    onNodeUpdate(selectedNode.id, { config: { ...selectedNode.config, parameters: nextParams } });
    setDialogState({ isOpen: false, mode: 'create' });
  };

  const handleRemove = (id: string) => {
    if (confirm('Delete this parameter?')) {
      const nextParams = parameters.filter(p => p.id !== id);
      onNodeUpdate(selectedNode.id, { config: { ...selectedNode.config, parameters: nextParams } });
    }
  };

  const title = direction === 'Input' ? '运行参数 (Input)' : '输出参数 (Output)';
  const btnColor = direction === 'Input' ? 'bg-[#00aed9] hover:bg-[#009ac1]' : 'bg-[#7e3ff2] hover:bg-[#6b33d4]';

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 flex items-center justify-between shrink-0 border-b border-[#eee] bg-[#fcfcfc]">
        <div className="flex items-center space-x-2">
          <div className={`w-1 h-4 rounded-full ${direction === 'Input' ? 'bg-[#00aed9]' : 'bg-[#7e3ff2]'}`}></div>
          <h3 className="text-[10px] font-bold text-[#555] uppercase tracking-widest">{title}</h3>
        </div>
        <button 
          onClick={() => setDialogState({ isOpen: true, mode: 'create' })}
          className={`${btnColor} text-white px-3 py-1.5 rounded text-[9px] font-bold uppercase transition-all shadow-sm flex items-center space-x-1`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New {direction}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredParams.length === 0 ? (
          <div className="h-64 border-2 border-dashed border-[#f0f0f0] rounded-xl flex flex-col items-center justify-center text-center p-8">
             <div className="w-12 h-12 bg-[#f9f9f9] rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#ddd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
             </div>
             <div className="text-[10px] font-bold text-[#bbb] uppercase mb-1">No {direction}s</div>
             <p className="text-[10px] text-[#ccc] max-w-[200px] leading-relaxed">
               Define parameters for this node.
             </p>
             <button 
               onClick={() => setDialogState({ isOpen: true, mode: 'create' })}
               className="mt-4 text-[10px] font-bold text-[#00aed9] hover:underline uppercase tracking-tight"
             >
               + Create Now
             </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="pb-2 text-[9px] font-bold text-[#aaa] uppercase tracking-wider border-b border-[#eee]">Key</th>
                  <th className="pb-2 text-[9px] font-bold text-[#aaa] uppercase tracking-wider border-b border-[#eee]">Type</th>
                  <th className="pb-2 text-[9px] font-bold text-[#aaa] uppercase tracking-wider border-b border-[#eee]">Source</th>
                  <th className="pb-2 text-[9px] font-bold text-[#aaa] uppercase tracking-wider border-b border-[#eee] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParams.map(p => (
                  <tr key={p.id} className="group hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 pr-2 border-b border-[#f5f5f5]">
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold ${p.isEnabled ? 'text-[#333]' : 'text-[#aaa]'}`}>{p.key}</span>
                        {p.sourceType !== 'Literal' && (
                          <span className="text-[8px] bg-[#e0f2fe] text-[#0369a1] px-1 py-0.5 rounded w-fit mt-1 font-bold">{p.sourceType.toUpperCase()}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-2 border-b border-[#f5f5f5]">
                      <span className="text-[10px] bg-[#f0f0f0] text-[#666] px-1.5 py-0.5 rounded font-mono">{p.valueType}</span>
                    </td>
                    <td className="py-3 pr-2 border-b border-[#f5f5f5]">
                      <div className="text-[10px] text-[#777] font-mono truncate max-w-[120px]">
                        {p.sourceType === 'Literal' ? (p.isSensitive ? '••••••••' : String(p.value)) : 
                         p.sourceType === 'Env' ? `$${p.envVarName}` : 
                         p.sourceType === 'Redis' ? `redis:${p.redisKey}` : 
                         p.sourceType === 'File' ? `file:${p.filePath}` : 
                         `db:${p.supabaseRef}`}
                      </div>
                    </td>
                    <td className="py-3 text-right border-b border-[#f5f5f5]">
                      <div className="flex items-center justify-end space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setInspectData(p)}
                          className="p-1.5 text-[#888] hover:bg-[#eee] rounded transition-colors"
                          title="Inspect Value"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => setDialogState({ isOpen: true, mode: 'edit', data: p })}
                          className="p-1.5 text-[#00aed9] hover:bg-[#e0f7fa] rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleRemove(p.id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {dialogState.isOpen && (
        <ParameterDialog
          title={dialogState.mode === 'create' ? `Create Node ${direction}` : 'Edit Node Parameter'}
          initialData={dialogState.data}
          defaultDirection={direction}
          onSave={handleSave}
          onClose={() => setDialogState({ isOpen: false, mode: 'create' })}
        />
      )}

      {inspectData && (
        <InspectValueDialog 
          parameter={inspectData} 
          onClose={() => setInspectData(null)} 
        />
      )}
    </div>
  );
};

export default NodeParameterEditor;
