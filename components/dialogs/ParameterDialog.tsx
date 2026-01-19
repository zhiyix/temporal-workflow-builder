
import React, { useState } from 'react';
import { WorkflowGlobal, GlobalValueType, ParameterSourceType } from '../../types/workflow';

interface ParameterDialogProps {
  title: string;
  initialData?: WorkflowGlobal;
  defaultDirection?: 'Input' | 'Output';
  onSave: (data: WorkflowGlobal) => void;
  onClose: () => void;
}

const ParameterDialog: React.FC<ParameterDialogProps> = ({ title, initialData, defaultDirection = 'Input', onSave, onClose }) => {
  const [formData, setFormData] = useState<WorkflowGlobal>(initialData || {
    id: Math.random().toString(36).substr(2, 9),
    key: '',
    value: '',
    defaultValue: '',
    valueType: 'String',
    sourceType: 'Literal',
    description: '',
    group: 'Default',
    isEnabled: true,
    isSensitive: false,
    priority: 0,
    paramDirection: defaultDirection,
    envVarName: '',
    redisKey: '',
    filePath: '',
    supabaseRef: ''
  });

  const handleChange = (field: keyof WorkflowGlobal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnvVarChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    handleChange('envVarName', formatted);
  };

  const isLiteral = formData.sourceType === 'Literal';
  
  const inputClasses = "w-full border border-[#ddd] bg-white text-[#333] rounded p-1.5 mt-1 outline-none focus:border-[#00aed9] transition-colors placeholder:text-[#ccc] text-[11px]";
  const labelClasses = "text-[#777] text-[10px] font-bold uppercase";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-lg rounded shadow-2xl flex flex-col overflow-hidden border border-[#dcdcdc]">
        {/* Header */}
        <div className="h-10 bg-[#333] flex items-center justify-between px-4 text-white">
          <span className="text-[11px] font-bold uppercase tracking-widest">{title}</span>
          <button onClick={onClose} className="hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Key (ASCII)</label>
              <input
                type="text"
                className={`${inputClasses} font-bold`}
                value={formData.key}
                onChange={(e) => handleChange('key', e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="e.g. timeout_ms"
              />
            </div>
            <div>
              <label className={labelClasses}>Group</label>
              <input
                type="text"
                className={inputClasses}
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                placeholder="e.g. Network"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Direction</label>
              <select
                className={inputClasses}
                value={formData.paramDirection}
                onChange={(e) => handleChange('paramDirection', e.target.value as any)}
              >
                <option value="Input">Input</option>
                <option value="Output">Output</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Data Type</label>
              <select
                className={inputClasses}
                value={formData.valueType}
                onChange={(e) => handleChange('valueType', e.target.value as GlobalValueType)}
              >
                <option value="Boolean">Boolean</option>
                <option value="Number">Number</option>
                <option value="String">String</option>
                <option value="Array">Array</option>
                <option value="Object">Object</option>
                <option value="ZSet">ZSet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClasses}>Source Type</label>
              <select
                className={`${inputClasses} border-[#00aed9] font-bold text-[#00aed9]`}
                value={formData.sourceType}
                onChange={(e) => handleChange('sourceType', e.target.value as ParameterSourceType)}
              >
                <option value="Literal">Literal (Manual)</option>
                <option value="Env">Env</option>
                <option value="Redis">Redis</option>
                <option value="File">File</option>
                <option value="Supabase">Supabase</option>
              </select>
            </div>
          </div>

          {/* Conditional Input based on Source Type */}
          {!isLiteral ? (
            <div className="bg-[#f0f9ff] p-3 border border-[#d0e9ff] rounded animate-in fade-in duration-200">
              {formData.sourceType === 'Env' && (
                <>
                  <label className="text-[#00aed9] text-[10px] font-bold uppercase">Env Variable Name</label>
                  <input
                    type="text"
                    className={`${inputClasses} font-mono mt-1`}
                    value={formData.envVarName || ''}
                    onChange={(e) => handleEnvVarChange(e.target.value)}
                    placeholder="e.g. API_ENDPOINT_URL"
                  />
                </>
              )}
              {formData.sourceType === 'Redis' && (
                <>
                  <label className="text-[#00aed9] text-[10px] font-bold uppercase">Redis Key</label>
                  <input
                    type="text"
                    className={`${inputClasses} font-mono mt-1`}
                    value={formData.redisKey || ''}
                    onChange={(e) => handleChange('redisKey', e.target.value)}
                    placeholder="e.g. config:timeout:primary"
                  />
                </>
              )}
              {formData.sourceType === 'File' && (
                <>
                  <label className="text-[#00aed9] text-[10px] font-bold uppercase">File Path</label>
                  <input
                    type="text"
                    className={`${inputClasses} font-mono mt-1`}
                    value={formData.filePath || ''}
                    onChange={(e) => handleChange('filePath', e.target.value)}
                    placeholder="e.g. /etc/config/settings.json"
                  />
                </>
              )}
              {formData.sourceType === 'Supabase' && (
                <>
                  <label className="text-[#00aed9] text-[10px] font-bold uppercase">Supabase Ref / Query</label>
                  <input
                    type="text"
                    className={`${inputClasses} font-mono mt-1`}
                    value={formData.supabaseRef || ''}
                    onChange={(e) => handleChange('supabaseRef', e.target.value)}
                    placeholder="e.g. workflows:config_id:123"
                  />
                </>
              )}
              <p className="text-[9px] text-[#5b95c2] mt-2 italic">Values are sourced externally at runtime. Value fields are hidden.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClasses}>Value</label>
                  <textarea
                    className={`${inputClasses} font-mono text-[10px] resize-none leading-relaxed`}
                    rows={2}
                    value={formData.value || ''}
                    onChange={(e) => handleChange('value', e.target.value)}
                    placeholder="Enter the runtime value..."
                  />
                </div>
                <div>
                  <label className={labelClasses}>Default Value</label>
                  <textarea
                    className={`${inputClasses} font-mono text-[10px] resize-none leading-relaxed border-[#ddd]`}
                    rows={2}
                    value={formData.defaultValue || ''}
                    onChange={(e) => handleChange('defaultValue', e.target.value)}
                    placeholder="Enter the fallback default value..."
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              className={`${inputClasses} resize-none`}
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Developer documentation..."
            />
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) => handleChange('isEnabled', e.target.checked)}
                className="w-3.5 h-3.5 accent-[#00aed9]"
              />
              <span className="text-[10px] font-bold text-[#666]">ENABLED</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSensitive}
                onChange={(e) => handleChange('isSensitive', e.target.checked)}
                className="w-3.5 h-3.5 accent-orange-500"
              />
              <span className="text-[10px] font-bold text-[#666]">SENSITIVE</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f5f5f5] border-t border-[#ddd] flex justify-end space-x-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-[#ccc] bg-white rounded text-[10px] font-bold uppercase text-[#666] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-1.5 bg-[#00aed9] text-white rounded text-[10px] font-bold uppercase hover:bg-[#009ac1] transition-all shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterDialog;
