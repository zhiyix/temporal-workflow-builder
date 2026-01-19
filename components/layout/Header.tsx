
import React from 'react';

interface HeaderProps {
  workflowName: string;
  onUndo: () => void;
  onRedo: () => void;
  onShowCode: () => void;
  onPublish: () => void;
  onWorkflowClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ workflowName, onUndo, onRedo, onShowCode, onPublish, onWorkflowClick }) => {
  return (
    <header className="h-[40px] border-b border-[#dcdcdc] bg-white flex items-center justify-between px-3 shrink-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
           <div className="bg-[#00aed9] w-6 h-6 rounded flex items-center justify-center mr-2 shadow-sm">
             <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
           </div>
           <div className="flex flex-col">
             <div className="text-[10px] text-[#777] font-bold leading-none uppercase tracking-tighter">Workflow Builder</div>
             <div className="flex items-center mt-0.5">
               <span 
                className="text-[11px] font-bold text-[#333] cursor-pointer hover:text-[#00aed9] hover:underline transition-colors"
                onClick={onWorkflowClick}
               >
                 {workflowName}
               </span>
               <span className="mx-1 text-[#bbb] text-[10px]">/</span>
               <span className="text-[10px] text-[#00aed9] font-bold uppercase">develop</span>
             </div>
           </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
         <div className="flex border border-[#ddd] rounded overflow-hidden mr-4">
            <button className="px-2 py-1 bg-white hover:bg-[#f5f5f5] border-r border-[#ddd] text-[10px] text-[#666]" onClick={onUndo}>Undo</button>
            <button className="px-2 py-1 bg-white hover:bg-[#f5f5f5] text-[10px] text-[#666]" onClick={onRedo}>Redo</button>
         </div>
         
         <button
          onClick={onShowCode}
          className="px-2.5 py-1 border border-[#ddd] rounded bg-[#f9f9f9] text-[10px] font-bold text-[#666] hover:bg-white transition-colors uppercase"
        >
          Go Artifact
        </button>
        <button
          className="px-4 py-1 bg-[#00aed9] text-white rounded text-[10px] font-bold uppercase shadow-sm hover:bg-[#009ac1] transition-all"
          onClick={onPublish}
        >
          Save & Publish
        </button>
      </div>
    </header>
  );
};

export default Header;
