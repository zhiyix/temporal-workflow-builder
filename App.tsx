
import React, { useState, useCallback, useRef, useMemo } from 'react';
import LogicFlow from '@logicflow/core';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import RightDock from './components/layout/RightDock';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import Sidebar from './components/panels/Sidebar';
import NodePropertyPanel from './components/panels/NodePropertyPanel';
import WorkflowPropertyPanel from './components/panels/WorkflowPropertyPanel';
import GlobalsPanel from './components/panels/GlobalsPanel';
import CodePreviewDialog from './components/dialogs/CodePreviewDialog';
import WorkflowListDialog from './components/dialogs/WorkflowListDialog';

import { INITIAL_DSL } from './config/constants';
import { MOCK_PIPELINES } from './config/mock_data';
import { WorkflowDSL, NodeInstance, WorkflowConfig, NodeType, WorkflowGlobal, RightTab } from './types/workflow';
import { transformDSLToLF, transformLFToDSL } from './services/dsl-transformer';
import { generateGoCode } from './services/codegen';

const App: React.FC = () => {
  const [dsl, setDsl] = useState<WorkflowDSL>(INITIAL_DSL);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RightTab>('workflow');
  const [showCode, setShowCode] = useState(false);
  const [showWorkflowList, setShowWorkflowList] = useState(false);
  const lfRef = useRef<LogicFlow | null>(null);

  const handleInit = (lf: LogicFlow) => {
    lfRef.current = lf;
  };

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };

  // 优化：使用内部 ref 来存储 DSL，减少因 DSL 变化导致的工作流重绘
  const handleDataChange = useCallback((lfData: any) => {
    setDsl(prev => {
      const updated = transformLFToDSL(lfData, {
        id: prev.id,
        name: prev.name,
        schemaVersion: prev.schemaVersion,
        workflowConfig: prev.workflowConfig,
        globals: prev.globals
      });
      
      // 深度对比 graph 部分，如果没有实质变化则不更新状态
      if (JSON.stringify(updated.graph) === JSON.stringify(prev.graph)) {
        return prev;
      }
      return updated;
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeTypeJson = e.dataTransfer.getData('nodeType');
    if (!nodeTypeJson || !lfRef.current) return;

    try {
      const nodeType = JSON.parse(nodeTypeJson) as NodeType;
      const point = lfRef.current.getPointByClient(e.clientX, e.clientY);
      const { canvasOverlayPosition: { x, y } } = point;

      const newNode = {
        id: `${nodeType.typeKey.split('.')[1] || 'node'}-${Math.random().toString(36).substr(2, 5)}`,
        type: nodeType.typeKey,
        x,
        y,
        text: { value: nodeType.displayName, x, y },
        properties: {
          config: { 
            key: (nodeType.typeKey.split('.')[1] || 'node') + '_' + Math.random().toString(36).substr(2, 3),
            description: '', 
            group: nodeType.category || 'Default', 
            tags: [], 
            priority: 0, 
            isOptional: false, 
            timeoutSeconds: 60,
            retryPolicy: { MaxAttempts: 3, InitialInterval: "5s", BackoffCoefficient: 2 },
            attributes: {}, 
            parameters: [], 
            inputs: {}
          },
          typeVersion: '1.0.0'
        }
      };

      lfRef.current.addNode(newNode);
      handleDataChange(lfRef.current.getGraphData());
    } catch (err) {
      console.error("Failed to parse dropped node type", err);
    }
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<NodeInstance>) => {
    if (!lfRef.current) return;
    const nodeModel = lfRef.current.getNodeModelById(nodeId);
    if (nodeModel) {
      if (updates.name !== undefined) {
        lfRef.current.updateText(nodeId, updates.name);
      }
      if (updates.config !== undefined) {
        nodeModel.setProperties({ config: updates.config });
      }
      handleDataChange(lfRef.current.getGraphData());
    }
  };

  const handleWorkflowUpdate = (updates: Partial<WorkflowConfig>) => {
    setDsl(prev => ({ ...prev, workflowConfig: { ...prev.workflowConfig, ...updates } }));
  };

  const handleGlobalsUpdate = (globals: WorkflowGlobal[]) => {
    setDsl(prev => ({ ...prev, globals }));
  };

  const onNodeSelect = (data: any) => {
    setSelectedNodeId(data?.id || null);
    if (data?.id) {
      setActiveTab('node');
    }
  };

  const selectedNode = useMemo(() => {
    return dsl.graph.nodes.find(n => n.id === selectedNodeId) || null;
  }, [dsl.graph.nodes, selectedNodeId]);

  // 使用 memo 化的 canvasData，但注意避免它在高频操作中重置
  const canvasData = useMemo(() => transformDSLToLF(dsl), [dsl.id]); 
  
  const generatedCode = useMemo(() => generateGoCode(dsl), [dsl]);

  return (
    <div className="flex flex-col h-full overflow-hidden select-none bg-white">
      <Header 
        workflowName={dsl.name}
        onUndo={() => lfRef.current?.undo()}
        onRedo={() => lfRef.current?.redo()}
        onShowCode={() => setShowCode(true)}
        onPublish={() => alert('Publishing v1.0.0...')}
        onWorkflowClick={() => setShowWorkflowList(true)}
      />

      <div className="h-8 bg-[#f5f5f5] border-b border-[#dcdcdc] flex items-center justify-between px-3 shrink-0">
         <div className="flex items-center space-x-4 text-[10px] text-[#888]">
            <div className="flex items-center space-x-1 cursor-pointer hover:text-[#333]">
               <span>Project Library</span>
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
               <span className="text-[#333] font-bold">{dsl.name}</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar onDragStart={handleDragStart} />

        <main
          className="flex-1 relative overflow-hidden bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <WorkflowCanvas
            initialData={canvasData}
            onNodeSelect={onNodeSelect}
            onDataChange={handleDataChange}
            onInit={handleInit}
          />
          
          <div className="absolute bottom-4 left-4 flex flex-col space-y-1 z-10">
             <button className="w-7 h-7 bg-white border border-[#ddd] rounded shadow-sm text-[12px] text-[#666] flex items-center justify-center hover:bg-[#f5f5f5]" onClick={() => lfRef.current?.zoom(true)} title="Zoom In">+</button>
             <button className="w-7 h-7 bg-white border border-[#ddd] rounded shadow-sm text-[12px] text-[#666] flex items-center justify-center hover:bg-[#f5f5f5]" onClick={() => lfRef.current?.zoom(false)} title="Zoom Out">-</button>
             <button className="w-7 h-7 bg-white border border-[#ddd] rounded shadow-sm text-[10px] text-[#666] flex items-center justify-center hover:bg-[#f5f5f5]" onClick={() => lfRef.current?.resetZoom()} title="Reset Zoom">1:1</button>
          </div>
        </main>

        <RightDock activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'workflow' && (
            <WorkflowPropertyPanel
              workflowConfig={dsl.workflowConfig}
              onWorkflowUpdate={handleWorkflowUpdate}
            />
          )}
          {activeTab === 'node' && (
            <NodePropertyPanel
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
            />
          )}
          {activeTab === 'globals' && (
            <GlobalsPanel 
              globals={dsl.globals}
              onUpdate={handleGlobalsUpdate}
            />
          )}
          {activeTab === 'debug' && (
            <div className="flex flex-col h-full bg-white font-sans">
              <div className="h-10 bg-[#333] flex items-center px-3 text-white uppercase text-[11px] font-bold tracking-widest">Debug Output</div>
              <div className="p-4 text-[10px] font-mono text-[#777]">No active workflow runs.</div>
            </div>
          )}
        </RightDock>
      </div>

      {showCode && (
        <CodePreviewDialog code={generatedCode} onClose={() => setShowCode(false)} />
      )}

      {showWorkflowList && (
        <WorkflowListDialog onClose={() => setShowWorkflowList(false)} onSelect={(wf) => {
          const mockData = MOCK_PIPELINES[wf.Id];
          if (mockData) {
            setDsl(mockData);
          } else {
            setDsl(prev => ({...prev, name: wf.Key, id: wf.Id, graph: { nodes: [], edges: [] }}));
          }
          setShowWorkflowList(false);
          setSelectedNodeId(null);
          // 关键：强制画布重新渲染
          lfRef.current?.render(transformDSLToLF(mockData || dsl));
        }} />
      )}

      <Footer 
        nodeCount={dsl.graph.nodes.length} 
        globalCount={dsl.globals.length} 
      />
    </div>
  );
};

export default App;
