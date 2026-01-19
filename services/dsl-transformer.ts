
import { WorkflowDSL, NodeInstance, EdgeInstance, NodeTypeKey } from '../types/workflow';

export const transformLFToDSL = (lfData: any, workflowMeta: any): WorkflowDSL => {
  const nodes: NodeInstance[] = lfData.nodes.map((n: any) => ({
    id: n.id,
    typeKey: n.type as NodeTypeKey,
    typeVersion: n.properties?.typeVersion || '1.0.0',
    name: typeof n.text === 'string' ? n.text : (n.text?.value || n.type),
    config: n.properties?.config || { inputs: {} },
    ui: { x: n.x, y: n.y }
  }));

  const edges: EdgeInstance[] = lfData.edges.map((e: any) => ({
    id: e.id,
    sourceNodeId: e.sourceNodeId,
    targetNodeId: e.targetNodeId,
    condition: e.properties?.condition
  }));

  return {
    ...workflowMeta,
    graph: { nodes, edges }
  };
};

export const transformDSLToLF = (dsl: WorkflowDSL) => {
  return {
    nodes: dsl.graph.nodes.map(n => ({
      id: n.id,
      type: n.typeKey,
      x: n.ui.x,
      y: n.ui.y,
      // Use object-based text to ensure coordinates are explicitly managed
      text: { value: n.name, x: n.ui.x, y: n.ui.y },
      properties: {
        config: n.config,
        typeVersion: n.typeVersion
      }
    })),
    edges: dsl.graph.edges.map(e => ({
      id: e.id,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
      properties: {
        condition: e.condition
      }
    }))
  };
};
