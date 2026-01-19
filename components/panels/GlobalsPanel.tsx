
import React, { useState } from 'react';
import { WorkflowGlobal } from '../../types/workflow';
import ParameterDialog from '../dialogs/ParameterDialog';
import InspectValueDialog from '../dialogs/InspectValueDialog';

interface GlobalsPanelProps {
  globals: WorkflowGlobal[];
  onUpdate: (globals: WorkflowGlobal[]) => void;
}

const GlobalsPanel: React.FC<GlobalsPanelProps> = ({ globals, onUpdate }) => {
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; data?: WorkflowGlobal }>({
    isOpen: false,
    mode: 'create'
  });

  const [inspectData, setInspectData] = useState<WorkflowGlobal | null>(null);

  const handleAdd = () => {
    setDialogState({ isOpen: true, mode: 'create' });
  };

  const handleEdit = (g: WorkflowGlobal) => {
    setDialogState({ isOpen: true, mode: 'edit', data: g });
  };

  const handleSave = (data: WorkflowGlobal) => {
    if (dialogState.mode === 'create') {
      onUpdate([...globals, data]);
    } else {
      onUpdate(globals.map(g => g.id === data.id ? data : g));
    }
    setDialogState({ isOpen: false, mode: 'create' });
  };

  const removeGlobal = (id: string) => {
    if (confirm('Are you sure you want to delete this global?')) {
      onUpdate(globals.filter(g => g.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-10 bg-[#333] flex items-center justify-between px-3 text-white shrink-0">
        <div className="flex items-center space-x-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.627m3.232-3.416A9 9 0 1111.314 2.138" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-wider">Workflow Globals</span>
        </div>
        <button onClick={handleAdd} className="bg-[#00aed9] hover:bg-[#009ac1] text-white px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors shadow-sm">
          Add Global
        </button>
      </div>

      <div className="p-3 overflow-y-auto flex-1">
        <p className="text-[10px] text-[#777] mb-4 leading-relaxed">
          Manage shared configuration keys, API secrets, and environment variables accessible via <code>{'{{globals.key}}'}</code>.
        </p>

        {globals.length === 0 ? (
          <div className="border-2 border-dashed border-[#eee] rounded-lg p-12 text-center">
            <span className="text-[10px] text-[#bbb] font-bold uppercase">No Globals Defined</span>
            <button onClick={handleAdd} className="block mx-auto mt-2 text-[#00aed9] hover:underline text-[11px] font-bold">Create your first global</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#eee] text-left">
                  <th className="py-2 text-[9px] font-bold text-[#999] uppercase pr-2">Group</th>
                  <th className="py-2 text-[9px] font-bold text-[#999] uppercase pr-2">Key / Source</th>
                  <th className="py-2 text-[9px] font-bold text-[#999] uppercase pr-2">Type</th>
                  <th className="py-2 text-[9px] font-bold text-[#999] uppercase pr-2">Preview</th>
                  <th className="py-2 text-[9px] font-bold text-[#999] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {globals.map((g) => (
                  <tr key={g.id} className={`border-b border-[#f5f5f5] group hover:bg-[#fafafa] ${!g.isEnabled ? 'opacity-50' : ''}`}>
                    <td className="py-2 pr-2 align-top">
                      <span className="text-[10px] text-[#888] font-mono">{g.group || 'Default'}</span>
                    </td>
                    <td className="py-2 pr-2 align-top">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#333]">{g.key}</span>
                        {g.sourceType !== 'Literal' ? (
                          <span className="text-[8px] text-[#00aed9] font-mono uppercase tracking-tighter" title="External Source Mapping">
                            {g.sourceType}: {g.envVarName || g.redisKey || g.filePath || g.supabaseRef}
                          </span>
                        ) : (
                          g.description && <span className="text-[9px] text-[#aaa] line-clamp-1">{g.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 pr-2 align-top">
                      <span className="text-[10px] text-[#666]">{g.valueType}</span>
                    </td>
                    <td className="py-2 pr-2 align-top">
                      {g.isSensitive ? (
                        <div className="text-[10px] text-[#bbb] italic">Encrypted Secret</div>
                      ) : (
                        <div className="text-[10px] text-[#666] truncate max-w-[150px]">{String(g.value)}</div>
                      )}
                    </td>
                    <td className="py-2 text-right align-top">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setInspectData(g)}
                          className="text-[#888] hover:text-[#333]"
                          title="Inspect Value"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEdit(g)}
                          className="text-[#00aed9] hover:text-[#009ac1]"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => removeGlobal(g.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          title={dialogState.mode === 'create' ? 'Create Workflow Global' : 'Edit Workflow Global'}
          initialData={dialogState.data}
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

export default GlobalsPanel;
