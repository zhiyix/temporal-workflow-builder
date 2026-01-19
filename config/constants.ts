
import { NodeTypeKey, WorkflowDSL, RetryPolicy } from '../types/workflow';

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  MaxAttempts: 3,
  InitialInterval: "5s",
  BackoffCoefficient: 2
};

const generatedId = 'wf-' + Math.random().toString(36).substr(2, 9);

export const INITIAL_DSL: WorkflowDSL = {
  id: generatedId,
  name: 'Main Pipeline',
  schemaVersion: 'wf-dsl/1',
  graph: {
    nodes: [
      {
        id: 'start-1',
        typeKey: NodeTypeKey.START,
        typeVersion: '1.0.0',
        name: 'Workflow Start',
        config: { 
          key: 'start_node',
          description: 'Initialization',
          group: 'Core',
          tags: [],
          priority: 0,
          isOptional: false,
          timeoutSeconds: 60,
          retryPolicy: DEFAULT_RETRY_POLICY,
          attributes: {},
          parameters: [],
          inputs: {} 
        },
        ui: { x: 250, y: 100 }
      }
    ],
    edges: []
  },
  workflowConfig: {
    id: generatedId,
    key: 'Main_Pipeline',
    description: 'A standard temporal processing pipeline.',
    tags: ['production', 'core'],
    attributes: {
      'team': 'platform',
      'priority': 'high'
    },
    workflowType: 'TemporalProcessor',
    taskQueue: 'MAIN_WORKERS',
    inputSchema: {},
    outputSchema: {}
  },
  globals: []
};
