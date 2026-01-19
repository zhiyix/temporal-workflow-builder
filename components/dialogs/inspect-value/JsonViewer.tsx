import React, { useState } from 'react';

interface JsonViewerProps {
  data: any;
  depth?: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, depth = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);

  if (!isObject && !isArray) {
    let displayValue = String(data);
    let colorClass = "text-[#333]";
    if (typeof data === 'string') {
      displayValue = `"${data}"`;
      colorClass = "text-green-600";
    } else if (typeof data === 'number') {
      colorClass = "text-blue-600";
    } else if (typeof data === 'boolean') {
      colorClass = "text-orange-600";
    }

    return <span className={`font-mono text-[11px] ${colorClass}`}>{displayValue}</span>;
  }

  const entries = isObject ? Object.entries(data) : data.map((v, i) => [i, v]);
  const bracketOpen = isObject ? '{' : '[';
  const bracketClose = isObject ? '}' : ']';

  return (
    <div className="font-mono text-[11px]">
      <span 
        className="cursor-pointer hover:bg-slate-100 px-1 rounded transition-colors inline-flex items-center"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <svg 
          className={`w-3 h-3 mr-1 transform transition-transform ${isCollapsed ? '-rotate-90' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-[#888]">{bracketOpen}</span>
        {isCollapsed && <span className="text-[#ccc] mx-1">...</span>}
      </span>

      {!isCollapsed && (
        <div className="ml-4 border-l border-[#eee] pl-2">
          {entries.map(([key, value], idx) => (
            <div key={key} className="py-0.5">
              <span className="text-[#9333ea]">{isObject ? `"${key}"` : idx}: </span>
              <JsonViewer data={value} depth={depth + 1} />
              {idx < entries.length - 1 && <span className="text-[#aaa]">,</span>}
            </div>
          ))}
        </div>
      )}
      <span className="text-[#888]">{bracketClose}</span>
    </div>
  );
};

export default JsonViewer;