import React, { useState } from 'react';
import { NODE_REGISTRY } from '../../config/node_registry';
import { NodeType, NodeTypeKey } from '../../types/workflow';

interface SidebarProps {
  onDragStart: (e: React.DragEvent, nodeType: NodeType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const [search, setSearch] = useState('');

  const categories = [
    { label: 'TRIGGERS', key: 'Input', color: 'bg-[#88b04b]' },
    { label: 'LOGIC', key: 'Control', color: 'bg-[#00aed9]' },
    { label: 'DATA', key: 'Data', color: 'bg-[#f39c12]' },
    { label: 'OUTPUT', key: 'Output', color: 'bg-[#e74c3c]' },
    { label: 'TEMPORAL', key: 'Temporal', color: 'bg-[#7e3ff2]' }
  ];

  // Filter out START node and apply search
  const filteredNodes = NODE_REGISTRY.filter(n => 
    n.typeKey !== NodeTypeKey.START &&
    n.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-52 bg-white border-r border-[#dcdcdc] flex flex-col overflow-hidden shrink-0">
      <div className="p-2 border-b border-[#eee]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search nodes..."
            className="w-full bg-[#f5f5f5] border border-[#ddd] rounded py-1 px-2 text-[11px] outline-none focus:border-[#00aed9]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {categories.map((cat) => {
          const nodes = filteredNodes.filter(n => n.category === cat.key);
          if (nodes.length === 0) return null;
          
          return (
            <div key={cat.label}>
              <div className="sidebar-group-title flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cat.color}`}></span>
                {cat.label}
              </div>
              <div className="flex flex-col">
                {nodes.map((node) => (
                  <div
                    key={node.typeKey}
                    draggable
                    onDragStart={(e) => onDragStart(e, node)}
                    className="node-item flex items-center py-2 px-3 border-b border-[#eee] cursor-grab active:cursor-grabbing"
                    title={node.description}
                  >
                    <span className="text-sm mr-2 opacity-80">{node.icon}</span>
                    <span className="text-[11px] font-medium text-[#444] truncate">{node.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;