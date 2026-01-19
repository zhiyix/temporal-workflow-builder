
import React from 'react';
import { WorkflowConfig } from '../../../types/workflow';
import AttributesEditor from './AttributesEditor';
import TagManager from './TagManager';

interface Props {
  workflowConfig: WorkflowConfig;
  onWorkflowUpdate: (updates: Partial<WorkflowConfig>) => void;
}

const WorkflowBasicAttributes: React.FC<Props> = ({ workflowConfig, onWorkflowUpdate }) => {
  const labelClasses = "text-[#777] block mt-4 first:mt-0 text-[10px] font-bold uppercase tracking-tight";
  const inputClasses = "w-full border border-[#ddd] bg-white text-[#333] rounded p-1.5 mt-1 focus:border-[#00aed9] outline-none transition-colors text-[11px] placeholder-[#ccc]";
  const sectionHeaderClasses = "bg-[#f5f5f5] px-3 py-1.5 border-y border-[#ddd] text-[9px] font-bold text-[#888] uppercase tracking-widest mt-6 first:mt-0 shrink-0";
  
  const validateASCII = (val: string) => val.replace(/[^a-zA-Z0-9_-]/g, '');

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className={sectionHeaderClasses}>General Info</div>
      <div className="p-4">
        <label className={labelClasses}>Global Resource ID (BigSerial)</label>
        <div className="bg-[#f9f9f9] border border-[#ddd] text-[#999] p-2 rounded text-[10px] font-mono mt-1 select-all cursor-default">{workflowConfig.id}</div>

        <label className={labelClasses}>Reference Key (ASCII Only)</label>
        <input 
          className={`${inputClasses} font-mono`}
          value={workflowConfig.key} 
          onChange={e => onWorkflowUpdate({ key: validateASCII(e.target.value) })}
          placeholder="e.g. USER_REGISTRATION_V2"
        />

        <label className={labelClasses}>Description</label>
        <textarea 
          className={`${inputClasses} resize-none h-24 leading-relaxed`} 
          value={workflowConfig.description} 
          onChange={e => onWorkflowUpdate({ description: e.target.value })}
          placeholder="Describe the overall business logic of this workflow..."
        />
      </div>

      <div className={sectionHeaderClasses}>Organization</div>
      <div className="p-4">
        <label className={labelClasses}>System Tags</label>
        <TagManager tags={workflowConfig.tags} onChange={tags => onWorkflowUpdate({ tags })} />
      </div>

      <div className={sectionHeaderClasses}>Advanced Attributes (JSONB)</div>
      <div className="p-4">
        <AttributesEditor 
          attributes={workflowConfig.attributes} 
          onChange={attributes => onWorkflowUpdate({ attributes })} 
        />
      </div>
    </div>
  );
};

export default WorkflowBasicAttributes;
