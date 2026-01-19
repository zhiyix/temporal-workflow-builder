
export enum NodeTypeKey {
  // Triggers (Input)
  START = 'control.start',
  DEVICE_STATE = 'trigger.device_state',
  DEVICE_CONNECT = 'trigger.device_connect',
  DEVICE_DISCONNECT = 'trigger.device_disconnect',
  DEVICE_INACTIVE = 'trigger.device_inactive',
  ENDPOINT = 'trigger.endpoint',
  DATA_TABLE = 'trigger.data_table',
  EVENT = 'trigger.event',
  GOOGLE_PUBSUB = 'trigger.google_pubsub',
  MQTT = 'trigger.mqtt',
  PARTICLE = 'trigger.particle',
  VIRTUAL_BUTTON = 'trigger.virtual_button',
  WEBHOOK = 'trigger.webhook',

  // Logic & Control
  END = 'control.end',
  IF = 'control.if',
  PARALLEL = 'control.parallel',
  DEBUG = 'control.debug',
  VALIDATE_DATA = 'control.validate_data',
  
  // Data
  READ_QUEUE = 'data.read_queue',
  FINALIZE_QUEUE = 'data.finalize_queue',
  EXTRACT_METADATA = 'data.extract_metadata',
  TRANSFORM = 'data.transform',
  MTCHANNEL_HEALTH = 'data.mtchannel_health',
  MACHINE_HEALTH = 'data.machine_health',
  MACHINE_STATUS_CALC = 'data.machine_status_calc',
  FACTORY_STATUS_CALC = 'data.factory_status_calc',
  HEALTH_TO_LINE_PROTOCOL = 'data.health_to_line_protocol',
  REALTIME_TO_LINE_PROTOCOL = 'data.realtime_to_line_protocol',

  // Output
  CACHE_REALTIME_STATE = 'output.cache_realtime_state',
  TDENGINE = 'output.tdengine',
  SUPABASE_VALIDATION_ERRORS = 'output.supabase_validation_errors',
  MT_FEATURE_STATUS = 'output.mt_feature_status',
  SUPABASE_STATUS = 'output.supabase_status',
  
  // Temporal & Actions
  ACTIVITY = 'temporal.activity',
  TIMER = 'control.timer',
  SIGNAL = 'control.signal',
  CHILD_WORKFLOW = 'temporal.child_workflow'
}

export type GlobalValueType = 'Boolean' | 'Number' | 'String' | 'Array' | 'Object' | 'ZSet';
export type ParameterSourceType = 'Literal' | 'Env' | 'Redis' | 'File' | 'Supabase';

export interface WorkflowGlobal {
  id: string;
  key: string;
  value: any;
  defaultValue?: any;
  valueType: GlobalValueType;
  sourceType: ParameterSourceType; // New field for selecting data source
  description?: string;
  group?: string;
  isEnabled: boolean;
  isSensitive: boolean;
  envVarName?: string;
  redisKey?: string;
  filePath?: string;
  supabaseRef?: string;
  priority: number;
  tags?: string[];
  paramDirection: 'Input' | 'Output';
}

export interface RetryPolicy {
  MaxAttempts: number;
  InitialInterval: string;
  BackoffCoefficient: number;
}

export interface NodeConfig {
  key: string;
  description: string;
  group: string;
  tags: string[];
  priority: number;
  isOptional: boolean;
  timeoutSeconds: number;
  retryPolicy: RetryPolicy;
  attributes: Record<string, string>;
  parameters: WorkflowGlobal[];
  inputs: Record<string, ValueBinding>;
  options?: Record<string, any>;
  activityName?: string;
  condition?: string;
  duration?: string;
  signalName?: string;
}

export interface ValueBinding {
  kind: 'literal' | 'ref';
  value?: any;
  ref?: {
    scope: 'wf.input' | 'node.output' | 'const' | 'globals';
    path: string;
    nodeId?: string;
  };
}

export interface NodeInstance {
  id: string;
  typeKey: NodeTypeKey;
  typeVersion: string;
  name: string;
  config: NodeConfig;
  ui: {
    x: number;
    y: number;
  };
}

export interface EdgeInstance {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition?: 'true' | 'false';
}

export interface WorkflowConfig {
  id: string;
  key: string;
  description: string;
  tags: string[];
  attributes: Record<string, string>;
  workflowType: string;
  taskQueue: string;
  inputSchema: any;
  outputSchema: any;
}

export interface WorkflowDSL {
  id: string;
  name: string;
  schemaVersion: string;
  graph: {
    nodes: NodeInstance[];
    edges: EdgeInstance[];
  };
  workflowConfig: WorkflowConfig;
  globals: WorkflowGlobal[];
}

export interface NodeType {
  typeKey: NodeTypeKey;
  displayName: string;
  category: 'Control' | 'Temporal' | 'Input' | 'Data' | 'Output';
  icon: string;
  description: string;
  color?: string;
}

export type RightTab = 'node' | 'workflow' | 'globals' | 'debug';
