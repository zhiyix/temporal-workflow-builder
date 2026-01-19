import React from 'react';

interface AttributesEditorProps {
  attributes: Record<string, string>;
  onChange: (attrs: Record<string, string>) => void;
}

const AttributesEditor: React.FC<AttributesEditorProps> = ({ attributes, onChange }) => {
  const validateASCII = (val: string) => val.replace(/[^a-zA-Z0-9_-]/g, '');
  
  const handleAdd = () => onChange({ ...attributes, [`key_${Object.keys(attributes).length}`]: '' });
  const handleRemove = (k: string) => {
    const next = { ...attributes };
    delete next[k];
    onChange(next);
  };
  const handleEntryChange = (oldK: string, newK: string, val: string) => {
    const next = { ...attributes };
    if (oldK !== newK) delete next[oldK];
    next[newK] = val;
    onChange(next);
  };

  return (
    <div className="space-y-2 mt-2">
      {Object.entries(attributes).length === 0 && (
        <div className="text-[10px] text-[#bbb] italic px-1">No custom attributes defined.</div>
      )}
      {/* Fix: Explicitly type the destructured arguments from Object.entries to ensure 'string' type inference */}
      {Object.entries(attributes).map(([k, v]: [string, string]) => (
        <div key={k} className="flex items-center space-x-1 group">
          <input 
            className="w-1/3 border border-[#ddd] bg-white text-[#333] rounded px-1.5 py-1 text-[10px] font-mono outline-none focus:border-[#00aed9] focus:ring-1 focus:ring-[#00aed9]/20" 
            value={k} 
            // Fix: Use React.ChangeEvent to properly type the event, ensuring target.value is recognized as a string.
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEntryChange(k, validateASCII(e.target.value), v)} 
            placeholder="Key"
          />
          <input 
            className="flex-1 border border-[#ddd] bg-white text-[#333] rounded px-1.5 py-1 text-[10px] text-[#333] outline-none focus:border-[#00aed9] focus:ring-1 focus:ring-[#00aed9]/20" 
            value={v} 
            // Fix: Explicitly type the event to React.ChangeEvent<HTMLInputElement>.
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEntryChange(k, k, e.target.value)} 
            placeholder="Value"
          />
          <button 
            onClick={() => handleRemove(k)} 
            className="text-[#ccc] hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors shrink-0"
            title="Remove attribute"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button 
        onClick={handleAdd} 
        className="w-full mt-2 py-1.5 border border-dashed border-[#ccc] text-[#00aed9] text-[10px] font-bold rounded hover:bg-[#f0f9ff] hover:border-[#00aed9] transition-all"
      >
        + ADD ATTRIBUTE
      </button>
    </div>
  );
};

export default AttributesEditor;