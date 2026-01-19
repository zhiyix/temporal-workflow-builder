
import { WorkflowDSL, NodeTypeKey } from '../types/workflow';
import { DEFAULT_RETRY_POLICY } from './constants';

const createBaseDSL = (id: string, name: string): WorkflowDSL => ({
  id,
  name,
  schemaVersion: 'wf-dsl/1',
  graph: { nodes: [], edges: [] },
  workflowConfig: {
    id,
    key: name.replace(/\s+/g, '_'),
    description: `Pipeline for ${name}`,
    tags: ['production'],
    attributes: {},
    workflowType: 'GenericWorkflow',
    taskQueue: 'MAIN_QUEUE',
    inputSchema: {},
    outputSchema: {}
  },
  globals: []
});

export const MOCK_PIPELINES: Record<string, WorkflowDSL> = {
  "1234567890": {
    ...createBaseDSL("1234567890", "Main Pipeline"),
    graph: {
      nodes: [
        { id: 'n1', typeKey: NodeTypeKey.START, typeVersion: '1.0.0', name: 'Start', config: { key: 'start', description: '', group: 'Core', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 100, y: 200 } },
        { id: 'n2', typeKey: NodeTypeKey.READ_QUEUE, typeVersion: '1.0.0', name: 'Read MQTT Queue', config: { key: 'read_q', description: '', group: 'Data', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 300, y: 200 } },
        { id: 'n3', typeKey: NodeTypeKey.TRANSFORM, typeVersion: '1.0.0', name: 'Format Data', config: { key: 'trans', description: '', group: 'Data', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 500, y: 200 } },
        { id: 'n4', typeKey: NodeTypeKey.FINALIZE_QUEUE, typeVersion: '1.0.0', name: 'ACK Messages', config: { key: 'fin_q', description: '', group: 'Data', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 700, y: 200 } },
        { id: 'n5', typeKey: NodeTypeKey.END, typeVersion: '1.0.0', name: 'End', config: { key: 'end', description: '', group: 'Core', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 900, y: 200 } }
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
        { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
        { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4' },
        { id: 'e4', sourceNodeId: 'n4', targetNodeId: 'n5' }
      ]
    }
  },
  "2345678901": {
    ...createBaseDSL("2345678901", "Audit Workflow"),
    graph: {
      nodes: [
        { id: 'a1', typeKey: NodeTypeKey.START, typeVersion: '1.0.0', name: 'Audit Trigger', config: { key: 'start', description: '', group: 'Core', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 150, y: 150 } },
        { id: 'a2', typeKey: NodeTypeKey.EXTRACT_METADATA, typeVersion: '1.0.0', name: 'Get Audit Logs', config: { key: 'meta', description: '', group: 'Data', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 350, y: 150 } },
        { id: 'a3', typeKey: NodeTypeKey.VALIDATE_DATA, typeVersion: '1.0.0', name: 'Check Compliance', config: { key: 'val', description: '', group: 'Logic', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 550, y: 150 } },
        { id: 'a4', typeKey: NodeTypeKey.SUPABASE_STATUS, typeVersion: '1.0.0', name: 'Save Result', config: { key: 'save', description: '', group: 'Output', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 750, y: 150 } },
        { id: 'a5', typeKey: NodeTypeKey.END, typeVersion: '1.0.0', name: 'Done', config: { key: 'end', description: '', group: 'Core', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 950, y: 150 } }
      ],
      edges: [
        { id: 'ae1', sourceNodeId: 'a1', targetNodeId: 'a2' },
        { id: 'ae2', sourceNodeId: 'a2', targetNodeId: 'a3' },
        { id: 'ae3', sourceNodeId: 'a3', targetNodeId: 'a4' },
        { id: 'ae4', sourceNodeId: 'a4', targetNodeId: 'a5' }
      ]
    }
  },
  "3456789012": {
    ...createBaseDSL("3456789012", "Device Provisioning"),
    graph: {
      nodes: [
        { id: 'd1', typeKey: NodeTypeKey.DEVICE_CONNECT, typeVersion: '1.0.0', name: 'Device Onboard', config: { key: 'conn', description: '', group: 'Trigger', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 200, y: 300 } },
        { id: 'd2', typeKey: NodeTypeKey.IF, typeVersion: '1.0.0', name: 'Is Authorized?', config: { key: 'auth', description: '', group: 'Logic', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {}, condition: 'input.Authorized == true' }, ui: { x: 450, y: 300 } },
        { id: 'd3', typeKey: NodeTypeKey.ACTIVITY, typeVersion: '1.0.0', name: 'Register Device', config: { key: 'reg', description: '', group: 'Temporal', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {}, activityName: 'RegisterDeviceActivity' }, ui: { x: 700, y: 200 } },
        { id: 'd4', typeKey: NodeTypeKey.DEBUG, typeVersion: '1.0.0', name: 'Log Error', config: { key: 'err', description: '', group: 'Logic', tags: [], priority: 0, isOptional: false, timeoutSeconds: 60, retryPolicy: DEFAULT_RETRY_POLICY, attributes: {}, parameters: [], inputs: {} }, ui: { x: 700, y: 400 } }
      ],
      edges: [
        { id: 'de1', sourceNodeId: 'd1', targetNodeId: 'd2' },
        { id: 'de2', sourceNodeId: 'd2', targetNodeId: 'd3', condition: 'true' },
        { id: 'de3', sourceNodeId: 'd2', targetNodeId: 'd4', condition: 'false' }
      ]
    }
  }
};
