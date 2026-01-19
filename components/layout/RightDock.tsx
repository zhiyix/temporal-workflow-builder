
import React from 'react';
import { RightTab } from '../../types/workflow';

interface RightDockProps {
  activeTab: RightTab;
  setActiveTab: (tab: RightTab) => void;
  children: React.ReactNode;
}

const RightDock: React.FC<RightDockProps> = ({ activeTab, setActiveTab, children }) => {
  const getPanelWidth = () => {
    if (activeTab === 'globals') return 'w-1/2 min-w-[650px]';
    return 'w-[480px]';
  };

  return (
    <div className="flex shrink-0 h-full">
      {/* Active Panel Container */}
      <div className={`${getPanelWidth()} border-l border-[#dcdcdc] overflow-hidden transition-all duration-300 ease-in-out bg-white flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.02)]`}>
        {children}
      </div>

      {/* Icon Tab Bar */}
      <div className="w-12 bg-[#f5f5f5] border-l border-[#dcdcdc] flex flex-col items-center py-4 space-y-5 shrink-0 h-full z-10">
        {/* Tab 1: Workflow Settings */}
        <button 
          onClick={() => setActiveTab('workflow')}
          className={`p-2 rounded-lg transition-all duration-200 ${activeTab === 'workflow' ? 'bg-white shadow-md text-[#00aed9] scale-110' : 'text-[#888] hover:text-[#666] hover:bg-[#ebebeb]'}`}
          title="Workflow Settings"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        {/* Tab 2: Node Properties */}
        <button 
          onClick={() => setActiveTab('node')}
          className={`p-2 rounded-lg transition-all duration-200 ${activeTab === 'node' ? 'bg-white shadow-md text-[#00aed9] scale-110' : 'text-[#888] hover:text-[#666] hover:bg-[#ebebeb]'}`}
          title="Node Properties"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <div className="w-8 h-[1px] bg-[#dcdcdc]"></div>

        <button 
          onClick={() => setActiveTab('globals')}
          className={`p-2 rounded-lg transition-all duration-200 ${activeTab === 'globals' ? 'bg-white shadow-md text-[#00aed9] scale-110' : 'text-[#888] hover:text-[#666] hover:bg-[#ebebeb]'}`}
          title="Globals Management"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </button>

        <button 
          onClick={() => setActiveTab('debug')}
          className={`p-2 rounded-lg transition-all duration-200 ${activeTab === 'debug' ? 'bg-white shadow-md text-[#00aed9] scale-110' : 'text-[#888] hover:text-[#666] hover:bg-[#ebebeb]'}`}
          title="Debug & Logs"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RightDock;
