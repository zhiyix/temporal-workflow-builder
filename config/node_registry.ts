import { NodeType, NodeTypeKey } from '../types/workflow';

export const NODE_REGISTRY: NodeType[] = [
  // Core / Entry
  {
    typeKey: NodeTypeKey.START,
    displayName: 'Workflow Start',
    category: 'Input',
    icon: '🚀',
    description: 'The entry point of the workflow.'
  },

  // Triggers
  {
    typeKey: NodeTypeKey.DEVICE_STATE,
    displayName: 'Device: State',
    category: 'Input',
    icon: '🎯',
    description: 'Triggered when a device reports state data.'
  },
  {
    typeKey: NodeTypeKey.DEVICE_CONNECT,
    displayName: 'Device: Connect',
    category: 'Input',
    icon: '🔌',
    description: 'Triggered when a device connects to the broker.'
  },
  {
    typeKey: NodeTypeKey.DEVICE_DISCONNECT,
    displayName: 'Device: Disconnect',
    category: 'Input',
    icon: '🔌',
    description: 'Triggered when a device disconnects from the broker.'
  },
  {
    typeKey: NodeTypeKey.DEVICE_INACTIVE,
    displayName: 'Device: Inactive',
    category: 'Input',
    icon: '💤',
    description: 'Triggered when a device hasn’t reported state for a duration.'
  },
  {
    typeKey: NodeTypeKey.ENDPOINT,
    displayName: 'Endpoint',
    category: 'Input',
    icon: '📥',
    description: 'Triggered via a public HTTP endpoint.'
  },
  {
    typeKey: NodeTypeKey.DATA_TABLE,
    displayName: 'Data Table',
    category: 'Input',
    icon: '📊',
    description: 'Triggered by changes in a data table.'
  },
  {
    typeKey: NodeTypeKey.EVENT,
    displayName: 'Event',
    category: 'Input',
    icon: '⚠️',
    description: 'Triggered when a specific system event occurs.'
  },
  {
    typeKey: NodeTypeKey.GOOGLE_PUBSUB,
    displayName: 'Google Pub/Sub',
    category: 'Input',
    icon: '☁️',
    description: 'Triggered by a Google Cloud Pub/Sub message.'
  },
  {
    typeKey: NodeTypeKey.MQTT,
    displayName: 'MQTT',
    category: 'Input',
    icon: '📡',
    description: 'Triggered by an MQTT message.'
  },
  {
    typeKey: NodeTypeKey.PARTICLE,
    displayName: 'Particle',
    category: 'Input',
    icon: '⚛️',
    description: 'Triggered by a Particle device event.'
  },
  {
    typeKey: NodeTypeKey.VIRTUAL_BUTTON,
    displayName: 'Virtual Button',
    category: 'Input',
    icon: '🔘',
    description: 'Triggered manually via the dashboard.'
  },
  {
    typeKey: NodeTypeKey.WEBHOOK,
    displayName: 'Webhook',
    category: 'Input',
    icon: '🔗',
    description: 'Triggered by an external webhook request.'
  },

  // Logic
  {
    typeKey: NodeTypeKey.IF,
    displayName: 'Conditional',
    category: 'Control',
    icon: '🔀',
    description: 'Conditional branching.'
  },
  {
    typeKey: NodeTypeKey.PARALLEL,
    displayName: 'Parallel Exec',
    category: 'Control',
    icon: '⏸️',
    description: 'Execute multiple branches concurrently.'
  },
  {
    typeKey: NodeTypeKey.VALIDATE_DATA,
    displayName: 'Validate Data',
    category: 'Control',
    icon: '🛡️',
    description: '数据有效性验证（ValidateData）是 Pipeline 中的“过滤器”。在数据 from MQTT 报文转换为标准格式后，系统需要确保进入计算逻辑和数据库的数据是真实可靠的。'
  },
  {
    typeKey: NodeTypeKey.END,
    displayName: 'Workflow End',
    category: 'Control',
    icon: '🏁',
    color: '#ef4444', // Override to Red
    description: 'Termination point of the workflow.'
  },
  {
    typeKey: NodeTypeKey.DEBUG,
    displayName: 'Debug',
    category: 'Control',
    icon: '🪲',
    color: '#666666', // Override to Grey
    description: 'Print debug information to the workflow log.'
  },

  // Data
  {
    typeKey: NodeTypeKey.READ_QUEUE,
    displayName: 'Read Queue',
    category: 'Data',
    icon: '📥',
    description: 'ReadQueue 是 Workflow Pipeline 的数据入口环节。它的核心职责是从指定的 Redis Stream 中批量读取由 MQTT 代理（如 Neuron）推送的原始设备消息。'
  },
  {
    typeKey: NodeTypeKey.FINALIZE_QUEUE,
    displayName: 'Finalize Queue',
    category: 'Data',
    icon: '🧹',
    description: '队列清理（FinalizeQueue）是整个 Workflow Pipeline 的收尾环节。它的核心职责是对已经在本次运行中被成功处理的消息执行“确认”和“清理”操作。'
  },
  {
    typeKey: NodeTypeKey.EXTRACT_METADATA,
    displayName: 'Extract Metadata',
    category: 'Data',
    icon: '📋',
    description: '提取元数据（ExtractMetadata）是 Workflow Pipeline 的基础准备环节。它的核心职责是为当前租户准备一份详尽的“设备字典”。这份元数据包含了工厂、设备、通道、测点通道及其相关的告警阈值 and 验证范围。'
  },
  {
    typeKey: NodeTypeKey.TRANSFORM,
    displayName: 'Transform',
    category: 'Data',
    icon: '🔄',
    description: '数据分组转换（Transform）是 Workflow Pipeline 中的核心环节。它的主要职责是将从 MQTT 队列中读取的原始报文（Raw Messages），根据预定义的业务逻辑 and 设备元数据，转换为标准化的数据组（DataGroup）。'
  },
  {
    typeKey: NodeTypeKey.MTCHANNEL_HEALTH,
    displayName: 'MTChannel Health',
    category: 'Data',
    icon: '❤️',
    description: '在 Workflow Pipeline 中，数据经过分组转换（Step 5）和有效性验证（Step 5.5）后，需要对每个测点通道（MTChannel）进行实时健康度评估。该步骤为后续的设备（Machine）和工厂（Factory）健康度聚合提供基础数据 input。'
  },
  {
    typeKey: NodeTypeKey.MACHINE_HEALTH,
    displayName: 'Machine Health',
    category: 'Data',
    icon: '🏭',
    description: 'Machine 健康度计算（MachineHealth）是健康度评估体系中的第二层聚合。它接收来自上一步（Step 5.6）生成的测点通道健康度（MTChannelHealth）数据，并将其聚合为设备级（Machine）的健康度评分。'
  },
  {
    typeKey: NodeTypeKey.MACHINE_STATUS_CALC,
    displayName: 'Machine Status',
    category: 'Data',
    icon: '🤖',
    description: 'MachineStatus 计算（MachineStatusCalc）是 Workflow Pipeline 中负责“设备健康管理”的核心逻辑。它根据 MTChannel 的在线情况和 MTFeature 的告警状态，通过内置的有限状态机（FSM）算法，自动判定并更新设备的实时运行状态.'
  },
  {
    typeKey: NodeTypeKey.FACTORY_STATUS_CALC,
    displayName: 'Factory Status',
    category: 'Data',
    icon: '🏢',
    description: 'FactoryStatus 计算（FactoryStatusCalc）是 Workflow Pipeline 中更高层级的“资产健康度聚合”逻辑。它的主要职责是根据下属各设备（Machine）的实时运行状态，通过内置的有限状态机（FSM）算法，自动判定并更新整个工厂（Factory）的整体运行状态。'
  },
  {
    typeKey: NodeTypeKey.HEALTH_TO_LINE_PROTOCOL,
    displayName: 'HealthToLineProtocol',
    category: 'Data',
    icon: '📜',
    description: '健康度转 Line Protocol（HealthToLineProtocol）是健康度处理流程的最后一步。它的核心职责是将测点健康度和设备健康度结构化数据，转换为标准化的 InfluxDB Line Protocol 格式，为后续写入 TDengine 做准备。'
  },
  {
    typeKey: NodeTypeKey.REALTIME_TO_LINE_PROTOCOL,
    displayName: 'RealtimeToLineProtocol',
    category: 'Data',
    icon: '📝',
    description: '实时数据转 Line Protocol（RealtimeToLineProtocol）是 Pipeline 中负责将“业务数据”转换为“数据库行协议”的关键步骤。它将经过验证的、标准化的测点数据组（Validated Groups），转换为 InfluxDB Line Protocol 格式的字符串。'
  },

  // Output
  {
    typeKey: NodeTypeKey.CACHE_REALTIME_STATE,
    displayName: 'Cache State',
    category: 'Output',
    icon: '💾',
    description: '实时状态缓存（CacheRealtimeState）是 Pipeline 中负责“状态持久化”的关键环节。它的主要职责是将每个测点通道（MTChannel）的最新一包特征数据存入 Redis，以供 API 页面实时展示 and 离线检测系统 use.'
  },
  {
    typeKey: NodeTypeKey.TDENGINE,
    displayName: 'TDengine',
    category: 'Output',
    icon: '🗄️',
    description: 'TDengine 写入（TDengine）是 Workflow Pipeline 的数据持久化环节。它的核心职责是将前面步骤生成的 Line Protocol 格式数据（包括原始设备特征数据 and 健康度评估数据）批量写入 TDengine 时序数据库。'
  },
  {
    typeKey: NodeTypeKey.SUPABASE_VALIDATION_ERRORS,
    displayName: 'Supabase Validation Errors',
    category: 'Output',
    icon: '❌',
    description: '保存验证错误（SaveValidationErrors）是 Pipeline 的异常记录持久化环节。它的核心职责是将 Step 5.4 数据有效性验证过程中产生的错误记录（如数值超出元数据定义的范围）批量保存到 Supabase 关系型数据库中。'
  },
  {
    typeKey: NodeTypeKey.MT_FEATURE_STATUS,
    displayName: 'MTFeature State',
    category: 'Output',
    icon: '📋',
    description: 'MTFeatureStatus（缓存测点特征状态）负责将“测点特征（MTFeature）”的业务状态同步到实时缓存。核心职责是从 Supabase 读取最新状态并结合元数据，以高性能 Hash 结构写入 Redis。'
  },
  {
    typeKey: NodeTypeKey.SUPABASE_STATUS,
    displayName: 'Machine/Factory State',
    category: 'Output',
    icon: '☁️',
    description: '状态持久化（Supabase Status）是负责将“计算结果”写回“管理系统”的环节。它接收设备及工厂状态变更列表，并通过 API 批量更新数据库中的实时状态字段。'
  },

  // Temporal / Actions
  {
    typeKey: NodeTypeKey.ACTIVITY,
    displayName: 'Temporal Activity',
    category: 'Temporal',
    icon: '⚡',
    description: 'Execute a Temporal Activity.'
  },
  {
    typeKey: NodeTypeKey.TIMER,
    displayName: 'Wait Timer',
    category: 'Temporal',
    icon: '⏲️',
    description: 'Pause execution for a duration.'
  },
  {
    typeKey: NodeTypeKey.SIGNAL,
    displayName: 'Signal Wait',
    category: 'Temporal',
    icon: '📡',
    description: 'Wait for an external signal.'
  },
  {
    typeKey: NodeTypeKey.CHILD_WORKFLOW,
    displayName: 'Child Workflow',
    category: 'Temporal',
    icon: '📦',
    description: 'Execute another workflow.'
  }
];