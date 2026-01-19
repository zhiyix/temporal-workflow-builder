
import React, { useEffect, useRef } from 'react';
import LogicFlow from '@logicflow/core';
import { RectNode, RectNodeModel } from '@logicflow/core';
import { SelectionSelect, Control, Menu } from '@logicflow/extension';
import { NODE_REGISTRY } from '../../config/node_registry';

interface CanvasProps {
  initialData: any;
  onNodeSelect: (nodeData: any) => void;
  onDataChange: (data: any) => void;
  onInit: (lf: LogicFlow) => void;
}

const WorkflowCanvas: React.FC<CanvasProps> = ({ initialData, onNodeSelect, onDataChange, onInit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lfRef = useRef<LogicFlow | null>(null);
  const currentWorkflowId = useRef<string | null>(null);

  // Initialize LogicFlow Instance
  useEffect(() => {
    if (!containerRef.current) return;

    const lf = new LogicFlow({
      container: containerRef.current,
      grid: { size: 20, type: 'dot', visible: true },
      plugins: [SelectionSelect, Control, Menu],
      edgeType: 'bezier',
      snapline: true,
      adjustEdgeStartAndEnd: true, // 关键：自动调整连线起点和终点
      keyboard: { enabled: true },
      stopScrollGraph: true,
      stopZoomGraph: true,
    });

    // Theme configuration - Enhanced anchors for better connectivity
    lf.setTheme({
      anchor: { 
        r: 4, 
        fill: '#ffffff', 
        stroke: '#00aed9', 
        strokeWidth: 2, 
        hoverFill: '#00aed9',
        hoverR: 6 // 鼠标悬停时放大，更易点击
      },
      bezier: { stroke: '#999', strokeWidth: 2, outlineColor: '#00aed9' },
      rect: { radius: 4, strokeWidth: 2 }
    });

    const categoryColors: Record<string, string> = {
      'Input': '#88b04b', 
      'Control': '#00aed9', 
      'Data': '#f39c12', 
      'Output': '#e74c3c', 
      'Temporal': '#7e3ff2'
    };

    // Helper to create node models
    const createBaseModel = (strokeColor: string) => {
      return class extends RectNodeModel {
        setAttributes() { 
          const self = this as any;
          self.width = 160; 
          self.height = 42; 
          self.radius = 4; 
          // 默认锚点通常已经足够，若无特殊需求无需覆盖 getAnchors
        }
        
        getNodeStyle() {
          const style = super.getNodeStyle();
          style.stroke = strokeColor;
          style.fill = '#ffffff';
          style.strokeWidth = 2;
          return style;
        }
      };
    };

    // Register all nodes from registry
    NODE_REGISTRY.forEach(node => {
      const strokeColor = node.color || categoryColors[node.category] || '#333333';
      lf.register({ 
        type: node.typeKey, 
        view: RectNode, 
        model: createBaseModel(strokeColor) 
      });
    });

    // Initial render of the first loaded data
    if (initialData) {
      lf.render(initialData);
      // Assuming nodes[0] or similar contains an ID to track workflow changes
      // or we just trust the component mount is enough for initial load
    }

    lfRef.current = lf;
    onInit(lf);

    // Event Listeners for data updates
    const handleUpdate = () => {
      if (!lfRef.current) return;
      const data = lfRef.current.getGraphData();
      onDataChange(data);
    };

    lf.on('node:click', ({ data }) => onNodeSelect(data));
    lf.on('blank:click', () => onNodeSelect(null));
    
    const changeEvents = [
      'node:dragend', 
      'edge:add', 
      'edge:delete', 
      'node:add', 
      'node:delete', 
      'text:update', 
      'properties:change',
      'connection:not-allowed'
    ];

    changeEvents.forEach(event => {
      lf.on(event, handleUpdate);
    });

    return () => {
      if (lfRef.current) {
        lfRef.current.destroy();
        lfRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Handle cross-workflow updates (only render when loading a different project)
  useEffect(() => {
    // We use a custom property in our DSL or just node length change to decide if it's a "Load" event
    // In a real app, you'd compare workflow IDs.
    if (lfRef.current && initialData) {
      // LogicFlow internally handles whether the data is truly "new" or just an update.
      // However, to prevent the re-render loop, we only call render if the data
      // fundamentally changed (e.g. initial render or clear).
      // If we are currently interacting, lfRef.current.getGraphData() will be updated.
      
      const currentData = lfRef.current.getGraphData();
      // Simple heuristic: if node count is drastically different or initial load
      if (currentData.nodes.length === 0 && initialData.nodes.length > 0) {
         lfRef.current.render(initialData);
      }
    }
  }, [initialData]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full lf-canvas-container" 
      style={{ outline: 'none' }} 
    />
  );
};

export default WorkflowCanvas;
