
import React, { useState, useEffect } from 'react';
import { WorkflowConfig } from '../../types/workflow';
import WorkflowBasicAttributes from './property-panel/WorkflowBasicAttributes';

interface WorkflowPropertyPanelProps {
  workflowConfig: WorkflowConfig;
  onWorkflowUpdate: (updates: Partial<WorkflowConfig>) => void;
}

const WorkflowPropertyPanel: React.FC<WorkflowPropertyPanelProps> = ({
  workflowConfig,
  onWorkflowUpdate
}) => {
  const [draftConfig, setDraftConfig] = useState<WorkflowConfig | null>(null);

  useEffect(() => {
    setDraftConfig(JSON.parse(JSON.stringify(workflowConfig)));
  }, [workflowConfig]);

  if (!draftConfig) return null;

  const handleUpdate = (updates: Partial<WorkflowConfig>) => {
    setDraftConfig(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const hasChanges = JSON.stringify(workflowConfig) !== JSON.stringify(draftConfig);

  const applyChanges = () => {
    if (draftConfig) {
      onWorkflowUpdate(draftConfig);
    }
  };

  const discardChanges = () => {
    setDraftConfig(JSON.parse(JSON.stringify(workflowConfig)));
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="h-10 bg-[#333] flex items-center px-4 text-white shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider truncate">Workflow Configuration</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#ddd] bg-[#f9f9f9] shrink-0">
        <button
          className="flex-1 py-2 text-[10px] font-bold uppercase tracking-tight transition-all border-b-2 text-[#00aed9] border-[#00aed9] bg-white"
        >
          基本属性
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col pb-16">
        <WorkflowBasicAttributes 
          workflowConfig={draftConfig} 
          onWorkflowUpdate={handleUpdate} 
        />
      </div>

      {/* Sticky Action Footer */}
      {hasChanges && (
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-[#ddd] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center justify-between px-4 z-20">
          <button 
            onClick={discardChanges}
            className="text-[10px] font-bold text-[#999] uppercase hover:text-[#666] transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={applyChanges}
            className="bg-[#00aed9] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase shadow-sm hover:bg-[#009ac1] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Config
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkflowPropertyPanel;
