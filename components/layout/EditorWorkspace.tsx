
import React from 'react';
import LogicFlow from '@logicflow/core';
import Header from './Header';
import Footer from './Footer';
import RightDock from './RightDock';
import Sidebar from '../panels/Sidebar';
import NodePropertyPanel from '../panels/NodePropertyPanel';
import WorkflowPropertyPanel from '../panels/WorkflowPropertyPanel';
import GlobalsPanel from '../panels/GlobalsPanel';
import WorkflowCanvas from '../canvas/WorkflowCanvas';
import { WorkflowDSL, NodeInstance, WorkflowConfig, NodeType, WorkflowGlobal, RightTab } from '../../types/workflow';

interface EditorWorkspaceProps {
  dsl: WorkflowDSL;
  selectedNode: NodeInstance | null;
  activeTab: RightTab;
  setActiveTab: (tab: RightTab) => void;
  onUndo: () => void;
  onRedo: () => void;
  onShowCode: () => void;
  onPublish: () => void;
  onInitCanvas: (lf: LogicFlow) => void;
  onNodeSelect: (data: any) => void;
  onDataChange: (data: any) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeInstance>) => void;
  onWorkflowUpdate: (updates: Partial<WorkflowConfig>) => void;
  onGlobalsUpdate: (globals: WorkflowGlobal[]) => void;
  canvasData: any;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const EditorWorkspace: React.FC<EditorWorkspaceProps> = (props) => {
  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      <Header 
        workflowName={props.dsl.name}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        onShowCode={props.onShowCode}
        onPublish={props.onPublish}
      />

      <div className="h-8 bg-[#f5f5f5] border-b border-[#dcdcdc] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center space-x-4 text-[10px] text-[#888]">
          <div className="flex items-center space-x-1 cursor-pointer hover:text-[#333]">
            <span>Project Library</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
            <span className="text-[#333] font-bold">{props.dsl.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar onDragStart={(e, type) => {
          e.dataTransfer.setData('nodeType', type.typeKey);
        }} />

        <main className="flex-1 relative overflow-hidden bg-white">
          <WorkflowCanvas
            initialData={props.canvasData}
            onNodeSelect={props.onNodeSelect}
            onDataChange={props.onDataChange}
            onInit={props.onInitCanvas}
          />
          
          <div className="absolute bottom-4 left-4 flex flex-col space-y-1 z-10">
            <button className="w-7 h-7 bg-white border border-[#ddd] rounded shadow-sm text-[12px] text-[#666] flex items-center justify-center hover:bg-[#f5f5f5]" onClick={props.zoomIn}>+</button>
            <button className="w-7 h-7 bg-white border border-[#ddd] rounded shadow-sm text-[12px] text-[#666] flex items-center justify-center hover:bg-[#f5f5f5]" onClick={props.zoomOut}>-</button>
            <button className="w-7 h-7 bg-white border border-[#ddd] rounded shadow-sm text-[10px] text-[#666] flex items-center justify-center hover:bg-[#f5f5f5]" onClick={props.resetZoom}>1:1</button>
          </div>
        </main>

        <RightDock activeTab={props.activeTab} setActiveTab={props.setActiveTab}>
          {props.activeTab === 'workflow' && (
            <WorkflowPropertyPanel
              workflowConfig={props.dsl.workflowConfig}
              onWorkflowUpdate={props.onWorkflowUpdate}
            />
          )}
          {props.activeTab === 'node' && (
            <NodePropertyPanel
              selectedNode={props.selectedNode}
              onNodeUpdate={props.onNodeUpdate}
            />
          )}
          {props.activeTab === 'globals' && (
            <GlobalsPanel 
              globals={props.dsl.globals}
              onUpdate={props.onGlobalsUpdate}
            />
          )}
          {props.activeTab === 'debug' && (
            <div className="flex flex-col h-full bg-white font-sans">
              <div className="h-10 bg-[#333] flex items-center px-3 text-white uppercase text-[11px] font-bold tracking-widest">Debug Output</div>
              <div className="p-4 text-[10px] font-mono text-[#777]">No active workflow runs.</div>
            </div>
          )}
        </RightDock>
      </div>

      <Footer 
        nodeCount={props.dsl.graph.nodes.length} 
        globalCount={props.dsl.globals.length} 
      />
    </div>
  );
};

export default EditorWorkspace;
