
import React, { useState } from 'react';

interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onChange }) => {
  const [tagInput, setTagInput] = useState('');

  const handleAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) onChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map(t => (
          <span key={t} className="bg-[#eee] text-[#666] px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center shadow-sm">
            {t}
            <button onClick={() => onChange(tags.filter(x => x !== t))} className="ml-1 text-[#aaa] hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <input 
        className="w-full border border-[#ddd] bg-white text-[#333] rounded p-1.5 mt-1 focus:border-[#00aed9] outline-none transition-colors text-[11px] placeholder-[#ccc]" 
        placeholder="Type tag and press Enter..." 
        value={tagInput}
        onChange={e => setTagInput(e.target.value)}
        onKeyDown={handleAdd}
      />
    </div>
  );
};

export default TagManager;
