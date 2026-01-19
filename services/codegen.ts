
import { WorkflowDSL, NodeTypeKey, NodeInstance, EdgeInstance, WorkflowGlobal } from '../types/workflow';

export const generateGoCode = (dsl: WorkflowDSL): string => {
  const { workflowConfig, graph } = dsl;
  const { nodes, edges } = graph;

  const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9_]/g, '_');
  const toPascalCase = (str: string) => str.replace(/(^\w|_\w)/g, m => m.replace('_', '').toUpperCase());

  // Helper to generate a Go struct based on parameters
  const generateStruct = (name: string, params: WorkflowGlobal[]) => {
    if (params.length === 0) return `type ${name} struct {}\n`;
    
    let structBody = `type ${name} struct {\n`;
    params.forEach(p => {
      // Fix: GlobalValueType does not contain 'JSON', using 'Object' or 'Array' instead
      const goType = p.valueType === 'Number' ? 'float64' : 
                     p.valueType === 'Boolean' ? 'bool' : 
                     (p.valueType === 'Object' || p.valueType === 'Array') ? 'map[string]interface{}' : 'string';
      structBody += `    ${toPascalCase(p.key)} ${goType} \`json:"${p.key}"\`\n`;
    });
    structBody += `}\n`;
    return structBody;
  };

  let code = `package workflows\n\nimport (\n    "context"\n    "time"\n\n    "go.temporal.io/sdk/workflow"\n)\n\n`;

  // List of nodes that act as activities
  const activityNodeTypes = [
    NodeTypeKey.ACTIVITY, 
    NodeTypeKey.TRANSFORM, 
    NodeTypeKey.READ_QUEUE, 
    NodeTypeKey.FINALIZE_QUEUE,
    NodeTypeKey.EXTRACT_METADATA,
    NodeTypeKey.VALIDATE_DATA,
    NodeTypeKey.CACHE_REALTIME_STATE,
    NodeTypeKey.MTCHANNEL_HEALTH,
    NodeTypeKey.MACHINE_HEALTH,
    NodeTypeKey.MACHINE_STATUS_CALC,
    NodeTypeKey.FACTORY_STATUS_CALC,
    NodeTypeKey.HEALTH_TO_LINE_PROTOCOL,
    NodeTypeKey.REALTIME_TO_LINE_PROTOCOL,
    NodeTypeKey.TDENGINE,
    NodeTypeKey.SUPABASE_VALIDATION_ERRORS,
    NodeTypeKey.MT_FEATURE_STATUS,
    NodeTypeKey.SUPABASE_STATUS
  ];

  // Generate Activity Structs for each node
  nodes.forEach(node => {
    if (activityNodeTypes.includes(node.typeKey)) {
      const safeId = sanitizeId(node.id);
      // Fix: paramDirection only supports 'Input' and 'Output', 'Env' is not a valid direction. 
      // Sourcing from Env is handled by sourceType property instead.
      const inputs = node.config.parameters.filter(p => p.paramDirection === 'Input');
      const outputs = node.config.parameters.filter(p => p.paramDirection === 'Output');
      
      code += `// ${node.name} Types\n`;
      code += generateStruct(`${toPascalCase(safeId)}Input`, inputs);
      code += generateStruct(`${toPascalCase(safeId)}Output`, outputs);
      code += `\n`;
    }
  });

  code += `type ${workflowConfig.workflowType}Input struct {\n    // Main workflow input schema\n}\n\ntype ${workflowConfig.workflowType}Output struct {\n    // Main workflow output schema\n}\n\n`;

  code += `func ${workflowConfig.workflowType}(ctx workflow.Context, input ${workflowConfig.workflowType}Input) (${workflowConfig.workflowType}Output, error) {\n`;
  code += `    logger := workflow.GetLogger(ctx)\n`;
  code += `    logger.Info("${workflowConfig.workflowType} started")\n\n`;
  code += `    ao := workflow.ActivityOptions{\n        StartToCloseTimeout: 10 * time.Second,\n        TaskQueue:           "${workflowConfig.taskQueue}",\n    }\n`;
  code += `    ctx = workflow.WithActivityOptions(ctx, ao)\n\n`;

  const startNode = nodes.find(n => n.typeKey === NodeTypeKey.START);
  if (!startNode) return "// Error: No Start node found.";

  let currentNodeId: string | undefined = startNode.id;
  const visited = new Set<string>();

  while (currentNodeId) {
    if (visited.has(currentNodeId)) break;
    visited.add(currentNodeId);

    const node = nodes.find(n => n.id === currentNodeId);
    if (!node) break;

    const safeId = sanitizeId(node.id);
    const pascalId = toPascalCase(safeId);

    if (activityNodeTypes.includes(node.typeKey)) {
        const actName = node.config.activityName || node.typeKey.split('.').pop() || "UnnamedActivity";
        // Fix: Removed invalid 'Env' direction check from filter
        const inputs = node.config.parameters.filter(p => p.paramDirection === 'Input');
        
        code += `    // Node: ${node.name} (${node.typeKey})\n`;
        code += `    actInput_${safeId} := ${pascalId}Input{\n`;
        inputs.forEach(p => {
          code += `        ${toPascalCase(p.key)}: ${p.valueType === 'String' ? `"${p.value}"` : p.value},\n`;
        });
        code += `    }\n`;
        code += `    var res_${safeId} ${pascalId}Output\n`;
        code += `    err_${safeId} := workflow.ExecuteActivity(ctx, "${actName}", actInput_${safeId}).Get(ctx, &res_${safeId})\n`;
        code += `    if err_${safeId} != nil {\n        return ${workflowConfig.workflowType}Output{}, err_${safeId}\n    }\n\n`;
    } else {
        switch (node.typeKey) {
          case NodeTypeKey.IF:
            code += `    // Node: ${node.name}\n`;
            code += `    if ${node.config.condition || "true"} {\n`;
            const trueEdge = edges.find(e => e.sourceNodeId === node.id && e.condition === 'true');
            if (trueEdge) code += `        // Branch to ${trueEdge.targetNodeId}\n`;
            code += `    } else {\n`;
            const falseEdge = edges.find(e => e.sourceNodeId === node.id && e.condition === 'false');
            if (falseEdge) code += `        // Branch to ${falseEdge.targetNodeId}\n`;
            code += `    }\n\n`;
            break;

          case NodeTypeKey.TIMER:
            code += `    // Wait ${node.config.duration || "10s"}\n`;
            code += `    workflow.Sleep(ctx, ${node.config.duration || "10*time.Second"})\n\n`;
            break;

          case NodeTypeKey.END:
            code += `    logger.Info("${workflowConfig.workflowType} completed")\n`;
            code += `    return ${workflowConfig.workflowType}Output{}, nil\n`;
            currentNodeId = undefined;
            continue;
        }
    }

    const nextEdge = edges.find(e => e.sourceNodeId === currentNodeId);
    currentNodeId = nextEdge?.targetNodeId;
  }

  code += `}\n`;
  return code;
};
