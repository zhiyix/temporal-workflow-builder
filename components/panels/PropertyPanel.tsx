
import React, { useState } from 'react';
import { NodeInstance, WorkflowConfig, NodeTypeKey } from '../../types/workflow';
import NodeBasicAttributes from './property-panel/NodeBasicAttributes';
import WorkflowBasicAttributes from './property-panel/WorkflowBasicAttributes';
import NodeParameterEditor from './property-panel/NodeParameterEditor';

interface PropertyPanelProps {
  selectedNode: NodeInstance | null;
  workflowConfig: WorkflowConfig;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeInstance>) => void;
  onWorkflowUpdate: (updates: Partial<WorkflowConfig>) => void;
}

type PanelTab = 'basic' | 'runtime' | 'output';

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  workflowConfig,
  onNodeUpdate,
  onWorkflowUpdate
}) => {
  const [activeTab, setActiveTab] = useState<PanelTab>('basic');

  const getHeaderColor = () => {
    if (!selectedNode) return 'bg-[#333]';
    if (selectedNode.typeKey === NodeTypeKey.START) return 'bg-[#88b04b]';
    if (selectedNode.typeKey === NodeTypeKey.END) return 'bg-[#ef4444]';
    const isControl = [NodeTypeKey.IF, NodeTypeKey.PARALLEL].includes(selectedNode.typeKey);
    return isControl ? 'bg-[#00aed9]' : 'bg-[#7e3ff2]';
  };

  const tabs: { key: PanelTab; label: string }[] = [
    { key: 'basic', label: '基本属性' },
    { key: 'runtime', label: '运行参数' },
    { key: 'output', label: '输出参数' }
  ];

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`h-10 ${getHeaderColor()} flex items-center justify-between px-4 text-white shrink-0`}>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[200px]">
            {selectedNode ? `${selectedNode.typeKey.split('.')[1]} properties` : 'Workflow Configuration'}
          </span>
        </div>
        {selectedNode && (
          <span className="text-[9px] font-mono bg-black/20 px-1.5 py-0.5 rounded text-white/80 shrink-0">
            {selectedNode.id.split('-').pop()}
          </span>
        )}
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
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'basic' ? (
          selectedNode ? (
            <NodeBasicAttributes selectedNode={selectedNode} onNodeUpdate={onNodeUpdate} />
          ) : (
            <WorkflowBasicAttributes workflowConfig={workflowConfig} onWorkflowUpdate={onWorkflowUpdate} />
          )
        ) : (
          selectedNode ? (
            /* Fix: Changed 'In' to 'Input' and 'Out' to 'Output' to match NodeParameterEditor direction prop type */
            <NodeParameterEditor 
              selectedNode={selectedNode} 
              direction={activeTab === 'runtime' ? 'Input' : 'Output'} 
              onNodeUpdate={onNodeUpdate} 
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-[#bbb]">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-[11px] font-bold uppercase tracking-widest">
                {activeTab === 'runtime' ? '运行参数' : '输出参数'} - 仅针对节点
              </p>
              <p className="text-[10px] mt-2 leading-relaxed">请先在画布上选择一个节点以编辑其{activeTab === 'runtime' ? '输入' : '输出'}参数。</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
