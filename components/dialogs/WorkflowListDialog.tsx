
import React, { useState } from 'react';

interface WorkflowRecord {
  Id: string;
  Key: string;
  Description: string | null;
  Group: string | null;
  Environment: string | null;
  Tags: string[] | null;
}

interface WorkflowListDialogProps {
  onClose: () => void;
  onSelect: (workflow: WorkflowRecord) => void;
}

const MOCK_WORKFLOWS: WorkflowRecord[] = [
  {
    Id: "1234567890",
    Key: "Main_Pipeline",
    Description: "Standard temporal processing for incoming device telemetry.",
    Group: "Production",
    Environment: "Cloud-US",
    Tags: ["core", "telemetry"]
  },
  {
    Id: "2345678901",
    Key: "Audit_Workflow",
    Description: "Handles regulatory auditing and logging for all tenant activities.",
    Group: "Compliance",
    Environment: "Azure-EU",
    Tags: ["security", "audit"]
  },
  {
    Id: "3456789012",
    Key: "Device_Provisioning",
    Description: null,
    Group: "IoT",
    Environment: null,
    Tags: ["setup"]
  },
  {
    Id: "4567890123",
    Key: "Alert_Aggregator",
    Description: "Aggregates minor alerts into major incidents.",
    Group: null,
    Environment: "Local-Edge",
    Tags: null
  },
  {
    Id: "5678901234",
    Key: "Billing_Engine",
    Description: "Monthly billing cycle calculation workflow.",
    Group: "Finance",
    Environment: "AWS-West",
    Tags: ["money", "recurring"]
  },
  {
    Id: "6789012345",
    Key: "Cleanup_Routine",
    Description: "Deletes old telemetry data from hot storage.",
    Group: "Maintenance",
    Environment: null,
    Tags: ["db", "cleanup"]
  }
];

const WorkflowListDialog: React.FC<WorkflowListDialogProps> = ({ onClose, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(MOCK_WORKFLOWS.length / itemsPerPage);

  const paginatedData = MOCK_WORKFLOWS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-8">
      <div className="bg-white w-full max-w-4xl rounded shadow-2xl flex flex-col overflow-hidden border border-[#dcdcdc] h-[650px]">
        {/* Header */}
        <div className="h-12 bg-[#333] flex items-center justify-between px-6 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-[#00aed9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-widest">Select Workflow Resource</span>
          </div>
          <button onClick={onClose} className="hover:text-red-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f9f9f9]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedData.map((wf) => (
              <div 
                key={wf.Id} 
                className="bg-white border border-[#ddd] rounded-lg p-5 hover:border-[#00aed9] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSelect(wf)}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon Avatar */}
                  <div className="w-12 h-12 bg-[#f0f9ff] border border-[#d0e9ff] rounded-full flex items-center justify-center text-[#00aed9] text-xl font-bold shrink-0 shadow-inner group-hover:bg-[#00aed9] group-hover:text-white transition-colors">
                    {wf.Key.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-bold text-[#333] truncate group-hover:text-[#00aed9] transition-colors">{wf.Key}</h3>
                      <span className="text-[9px] font-mono text-[#aaa] bg-[#f5f5f5] px-1.5 py-0.5 rounded ml-2">ID: {wf.Id}</span>
                    </div>

                    <div className="mt-2 space-y-2">
                       {/* Metadata Row */}
                       <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <div className="flex flex-col">
                             <label className="text-[8px] font-bold text-[#bbb] uppercase tracking-tighter leading-none">Group</label>
                             <span className={`text-[10px] ${wf.Group ? 'text-[#666]' : 'text-[#ccc] italic'}`}>
                                {wf.Group || "— No Group —"}
                             </span>
                          </div>
                          <div className="flex flex-col">
                             <label className="text-[8px] font-bold text-[#bbb] uppercase tracking-tighter leading-none">Environment</label>
                             <span className={`text-[10px] ${wf.Environment ? 'text-[#666]' : 'text-[#ccc] italic'}`}>
                                {wf.Environment || "— Not Set —"}
                             </span>
                          </div>
                       </div>

                       {/* Tags */}
                       {wf.Tags && wf.Tags.length > 0 ? (
                         <div className="flex flex-wrap gap-1">
                            {wf.Tags.map(tag => (
                              <span key={tag} className="text-[8px] bg-[#eee] text-[#888] font-bold uppercase px-1.5 py-0.5 rounded shadow-xs">
                                {tag}
                              </span>
                            ))}
                         </div>
                       ) : (
                         <span className="text-[9px] text-[#ddd] italic">No Tags</span>
                       )}

                       {/* Description */}
                       <p className={`text-[10px] leading-relaxed line-clamp-2 mt-1 ${wf.Description ? 'text-[#777]' : 'text-[#ccc] italic'}`}>
                         {wf.Description || "No detailed description provided for this workflow resource."}
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="h-16 border-t border-[#ddd] flex items-center justify-between px-8 bg-white shrink-0">
          <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border border-[#ddd] rounded text-[10px] font-bold uppercase disabled:opacity-30 hover:bg-[#f5f5f5]"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 bg-[#00aed9] text-white rounded text-[10px] font-bold uppercase disabled:opacity-30 hover:bg-[#009ac1] shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowListDialog;
