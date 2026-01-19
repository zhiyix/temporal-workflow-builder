
import React from 'react';

interface FooterProps {
  nodeCount: number;
  globalCount: number;
}

const Footer: React.FC<FooterProps> = ({ nodeCount, globalCount }) => {
  return (
    <footer className="h-6 bg-[#333] text-white flex items-center px-3 justify-between shrink-0">
      <div className="flex items-center space-x-4 text-[9px] font-bold tracking-widest uppercase">
        <div className="flex items-center">
           <span className="w-1.5 h-1.5 rounded-full bg-[#00aed9] mr-1.5"></span>
           CONNECTED
        </div>
        <div className="opacity-60">DSL v1.0</div>
      </div>
      <div className="text-[9px] font-mono opacity-60">Nodes: {nodeCount} | Globals: {globalCount}</div>
    </footer>
  );
};

export default Footer;
