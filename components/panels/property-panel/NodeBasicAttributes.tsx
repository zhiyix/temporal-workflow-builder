
import React from 'react';
import { NodeInstance, NodeTypeKey, RetryPolicy } from '../../../types/workflow';
import AttributesEditor from './AttributesEditor';
import TagManager from './TagManager';

interface Props {
  selectedNode: NodeInstance;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeInstance>) => void;
}

const NodeBasicAttributes: React.FC<Props> = ({ selectedNode, onNodeUpdate }) => {
  const nodeConfig = selectedNode.config;
  const labelClasses = "text-[#777] block mt-4 first:mt-0 text-[10px] font-bold uppercase tracking-tight";
  const inputClasses = "w-full border border-[#ddd] bg-white text-[#333] rounded p-1.5 mt-1 focus:border-[#00aed9] outline-none transition-colors text-[11px] placeholder-[#ccc]";
  const sectionHeaderClasses = "bg-[#f5f5f5] px-3 py-1.5 border-y border-[#ddd] text-[9px] font-bold text-[#888] uppercase tracking-widest mt-6 first:mt-0 shrink-0";

  const updateNodeConfig = (updates: Partial<typeof nodeConfig>) => {
    onNodeUpdate(selectedNode.id, { config: { ...nodeConfig, ...updates } });
  };

  const updateRetry = (updates: Partial<RetryPolicy>) => {
    updateNodeConfig({ retryPolicy: { ...nodeConfig.retryPolicy, ...updates } });
  };

  const validateASCII = (val: string) => val.replace(/[^a-zA-Z0-9_-]/g, '');

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className={sectionHeaderClasses}>Identity & Metadata</div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClasses}>ID (bigserial)</label>
            <div className="bg-[#f9f9f9] border border-[#ddd] text-[#999] p-2 rounded text-[10px] font-mono mt-1 overflow-hidden truncate" title={selectedNode.id}>{selectedNode.id}</div>
          </div>
          <div>
            <label className={labelClasses}>Key (ASCII Only)</label>
            <input 
              className={`${inputClasses} font-mono`} 
              value={nodeConfig.key} 
              onChange={e => updateNodeConfig({ key: validateASCII(e.target.value) })}
              placeholder="NODE_KEY_01"
            />
          </div>
        </div>

        <label className={labelClasses}>Display Name</label>
        <input 
          className={inputClasses} 
          value={selectedNode.name} 
          onChange={e => onNodeUpdate(selectedNode.id, { name: e.target.value })}
          placeholder="Human readable name"
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>Logical Group</label>
            <input 
              className={inputClasses} 
              value={nodeConfig.group || ''} 
              onChange={e => updateNodeConfig({ group: e.target.value })}
              placeholder="e.g. Billing"
            />
          </div>
          <div>
            <label className={labelClasses}>Priority</label>
            <input 
              type="number"
              className={inputClasses} 
              value={nodeConfig.priority || 0} 
              onChange={e => updateNodeConfig({ priority: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <label className={labelClasses}>Detailed Description</label>
        <textarea 
          className={`${inputClasses} resize-none h-20`} 
          value={nodeConfig.description} 
          onChange={e => updateNodeConfig({ description: e.target.value })}
          placeholder="What does this specific step do?"
        />

        <label className={labelClasses}>Node Tags</label>
        <TagManager tags={nodeConfig.tags} onChange={tags => updateNodeConfig({ tags })} />
      </div>

      {(selectedNode.typeKey === NodeTypeKey.ACTIVITY || selectedNode.typeKey === NodeTypeKey.IF || selectedNode.typeKey === NodeTypeKey.TIMER) && (
        <>
          <div className={sectionHeaderClasses}>Temporal Configuration</div>
          <div className="p-4">
            {selectedNode.typeKey === NodeTypeKey.ACTIVITY && (
              <>
                <label className={labelClasses}>Temporal Activity Name</label>
                <input className={`${inputClasses} font-mono`} value={nodeConfig.activityName} onChange={e => updateNodeConfig({ activityName: e.target.value })} placeholder="ProcessPaymentActivity" />
              </>
            )}
            {selectedNode.typeKey === NodeTypeKey.IF && (
              <>
                <label className={labelClasses}>Condition Expression (Go)</label>
                <textarea className={`${inputClasses} font-mono h-24`} value={nodeConfig.condition} onChange={e => updateNodeConfig({ condition: e.target.value })} placeholder="input.Amount > 1000" />
              </>
            )}
            {selectedNode.typeKey === NodeTypeKey.TIMER && (
              <>
                <label className={labelClasses}>Wait Duration</label>
                <input className={`${inputClasses} font-mono`} value={nodeConfig.duration} onChange={e => updateNodeConfig({ duration: e.target.value })} placeholder="5 * time.Minute" />
              </>
            )}
          </div>
        </>
      )}

      <div className={sectionHeaderClasses}>Execution Control</div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Timeout (seconds)</label>
          <input type="number" className={inputClasses} value={nodeConfig.timeoutSeconds || 60} onChange={e => updateNodeConfig({ timeoutSeconds: parseInt(e.target.value) || 60 })} />
        </div>
        <div className="flex flex-col justify-end pb-1.5">
          <label className="flex items-center space-x-2 cursor-pointer py-1 px-2 border border-[#ddd] rounded hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              checked={nodeConfig.isOptional} 
              onChange={e => updateNodeConfig({ isOptional: e.target.checked })} 
              className="w-3.5 h-3.5 accent-[#00aed9]"
            />
            <span className="text-[10px] text-[#666] font-bold">IS OPTIONAL</span>
          </label>
        </div>
      </div>

      <div className={sectionHeaderClasses}>Reliability (Retry Policy)</div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Max Attempts</label>
            <input type="number" className={inputClasses} value={nodeConfig.retryPolicy.MaxAttempts} onChange={e => updateRetry({ MaxAttempts: parseInt(e.target.value) || 1 })} />
          </div>
          <div>
            <label className={labelClasses}>Backoff Coefficient</label>
            <input type="number" step="0.1" className={inputClasses} value={nodeConfig.retryPolicy.BackoffCoefficient} onChange={e => updateRetry({ BackoffCoefficient: parseFloat(e.target.value) || 2 })} />
          </div>
        </div>
        <div>
          <label className={labelClasses}>Initial Interval (Go time string)</label>
          <input className={`${inputClasses} font-mono`} value={nodeConfig.retryPolicy.InitialInterval} onChange={e => updateRetry({ InitialInterval: e.target.value })} placeholder="e.g. 1s, 500ms, 1m" />
        </div>
      </div>

      <div className={sectionHeaderClasses}>Dynamic Attributes (JSONB)</div>
      <div className="p-4">
        <AttributesEditor 
          attributes={nodeConfig.attributes} 
          onChange={attributes => updateNodeConfig({ attributes })} 
        />
      </div>
    </div>
  );
};

export default NodeBasicAttributes;
