import React, { useState, useMemo, useEffect } from 'react';

interface SmartPaginatedTableProps {
  data: any[];
  type: 'Array' | 'ZSet';
}

const SmartPaginatedTable: React.FC<SmartPaginatedTableProps> = ({ data, type }) => {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    
    return data.filter(item => {
      if (typeof item === 'object' && item !== null) {
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(query)
        );
      }
      return String(item).toLowerCase().includes(query);
    });
  }, [data, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  
  const currentData = useMemo(() => {
    return filteredData.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredData, page]);

  const columns = useMemo(() => {
    if (data.length === 0) return ['Value'];
    
    const isZSet = type === 'ZSet';
    const firstItem = data[0];
    
    if (typeof firstItem === 'object' && firstItem !== null) {
      if (isZSet) return ['Score', 'Member'];
      
      const keys = new Set<string>();
      data.slice(0, 20).forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(k => keys.add(k));
        }
      });
      return Array.from(keys);
    }
    
    return ['Value'];
  }, [data, type]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-3 border-b border-slate-100 bg-white shrink-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-[11px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
            placeholder={`Keyword Search across all fields (${filteredData.length} records)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#f8fafc] z-10 shadow-sm">
            <tr>
              <th className="w-12 px-4 py-3 text-left text-[10px] font-bold text-[#64748b] uppercase border-b border-slate-200 bg-slate-50">#</th>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 text-left text-[10px] font-bold text-[#64748b] uppercase border-b border-slate-200 bg-slate-50 min-w-[120px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData.map((item, idx) => {
              const globalIdx = page * pageSize + idx;
              return (
                <tr key={globalIdx} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-2.5 text-[10px] font-mono text-slate-400 border-r border-slate-50">{globalIdx}</td>
                  {columns.map(col => {
                    let cellValue: any = '-';
                    if (typeof item === 'object' && item !== null) {
                      cellValue = (item as any)[col] ?? (item as any)[col.toLowerCase()] ?? '-';
                    } else if (col === 'Value') {
                      cellValue = item;
                    }

                    const isComplex = typeof cellValue === 'object' && cellValue !== null;

                    return (
                      <td key={col} className="px-4 py-2.5 text-[11px] font-mono text-slate-700">
                        {isComplex ? (
                          <div className="max-h-20 overflow-hidden text-[10px] text-purple-600 bg-purple-50/50 p-1 rounded border border-purple-100/50">
                            {JSON.stringify(cellValue)}
                          </div>
                        ) : (
                          <span className={typeof cellValue === 'number' ? 'text-blue-600' : typeof cellValue === 'boolean' ? 'text-orange-600' : 'text-slate-700'}>
                            {String(cellValue)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-24 text-center text-slate-300 italic text-[12px]">
                  {searchQuery ? `No records match "${searchQuery}"` : 'Collection is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="h-12 bg-slate-50 border-t border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="text-[11px] text-slate-500">
          Showing <span className="font-bold text-slate-700">{filteredData.length === 0 ? 0 : page * pageSize + 1}</span> to <span className="font-bold text-slate-700">{Math.min(filteredData.length, (page + 1) * pageSize)}</span> of <span className="font-bold text-slate-700">{filteredData.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
          >
            Prev
          </button>
          <div className="text-[11px] font-mono font-bold text-slate-500 px-3">
            {page + 1} / {totalPages}
          </div>
          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartPaginatedTable;