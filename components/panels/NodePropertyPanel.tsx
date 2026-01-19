
import React, { useState, useEffect } from 'react';
import { NodeInstance, NodeTypeKey } from '../../types/workflow';
import NodeBasicAttributes from './property-panel/NodeBasicAttributes';
import NodeParameterEditor from './property-panel/NodeParameterEditor';

interface NodePropertyPanelProps {
  selectedNode: NodeInstance | null;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeInstance>) => void;
}

type NodePanelTab = 'basic' | 'runtime' | 'output';

const NodePropertyPanel: React.FC<NodePropertyPanelProps> = ({
  selectedNode,
  onNodeUpdate
}) => {
  const [activeTab, setActiveTab] = useState<NodePanelTab>('basic');
  const [draftNode, setDraftNode] = useState<NodeInstance | null>(null);

  // Sync draft when selectedNode changes
  useEffect(() => {
    setDraftNode(selectedNode ? JSON.parse(JSON.stringify(selectedNode)) : null);
  }, [selectedNode]);

  if (!selectedNode || !draftNode) {
    return (
      <div className="h-full bg-[#f9f9f9] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <svg className="w-8 h-8 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <span className="text-[11px] font-bold text-[#888] uppercase tracking-widest">No Node Selected</span>
        <p className="text-[10px] text-[#aaa] mt-2">Select a node on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleDraftUpdate = (updates: Partial<NodeInstance>) => {
    setDraftNode(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const hasChanges = JSON.stringify(selectedNode) !== JSON.stringify(draftNode);

  const applyChanges = () => {
    if (draftNode) {
      onNodeUpdate(draftNode.id, draftNode);
    }
  };

  const discardChanges = () => {
    setDraftNode(JSON.parse(JSON.stringify(selectedNode)));
  };

  const getHeaderColor = () => {
    if (draftNode.typeKey === NodeTypeKey.START) return 'bg-[#88b04b]';
    if (draftNode.typeKey === NodeTypeKey.END) return 'bg-[#ef4444]';
    const isControl = [NodeTypeKey.IF, NodeTypeKey.PARALLEL].includes(draftNode.typeKey);
    return isControl ? 'bg-[#00aed9]' : 'bg-[#7e3ff2]';
  };

  const tabs: { key: NodePanelTab; label: string }[] = [
    { key: 'basic', label: '基本属性' },
    { key: 'runtime', label: '运行参数' },
    { key: 'output', label: '输出参数' }
  ];

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className={`h-10 ${getHeaderColor()} flex items-center justify-between px-4 text-white shrink-0`}>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[200px]">
            {draftNode.typeKey.split('.')[1]} properties
          </span>
        </div>
        <span className="text-[9px] font-mono bg-black/20 px-1.5 py-0.5 rounded text-white/80 shrink-0">
          {draftNode.id.split('-').pop()}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#ddd] bg-[#f9f9f9] shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-tight transition-all border-b-2 ${
              activeTab === tab.key 
                ? 'text-[#00aed9] border-[#00aed9] bg-white' 
                : 'text-[#999] border-transparent hover:text-[#666] hover:bg-[#f0f0f0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col pb-16">
        {activeTab === 'basic' && (
          <NodeBasicAttributes 
            selectedNode={draftNode} 
            onNodeUpdate={(_, updates) => handleDraftUpdate(updates)} 
          />
        )}
        {activeTab === 'runtime' && (
          <NodeParameterEditor 
            selectedNode={draftNode} 
            direction="Input" 
            onNodeUpdate={(_, updates) => handleDraftUpdate(updates)} 
          />
        )}
        {activeTab === 'output' && (
          <NodeParameterEditor 
            selectedNode={draftNode} 
            direction="Output" 
            onNodeUpdate={(_, updates) => handleDraftUpdate(updates)} 
          />
        )}
      </div>

      {/* Sticky Action Footer */}
      {hasChanges && (
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-[#ddd] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center justify-between px-4 z-20">
          <button 
            onClick={discardChanges}
            className="text-[10px] font-bold text-[#999] uppercase hover:text-[#666] transition-colors"
          >
            Discard Changes
          </button>
          <button 
            onClick={applyChanges}
            className="bg-[#00aed9] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase shadow-sm hover:bg-[#009ac1] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default NodePropertyPanel;
