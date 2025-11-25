"use client";
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { Calendar, RefreshCw, Clock } from 'lucide-react';

export default function DateRangeSelector({ from, to, onChange, onRefresh, lastUpdated }) {
  const [localFrom, setLocalFrom] = useState(from || '');
  const [localTo, setLocalTo] = useState(to || '');
  const debounceRef = useRef(null);

  useEffect(() => { setLocalFrom(from || ''); }, [from]);
  useEffect(() => { setLocalTo(to || ''); }, [to]);

  const emitChange = (nextFrom, nextTo) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange?.({ from: nextFrom || null, to: nextTo || null });
    }, 300);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-wrap items-end gap-2 sm:gap-3">
        {/* From Date Input */}
        <div className="flex-1 min-w-[120px]">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-500" strokeWidth={2} />
            From
          </label>
          <input 
            type="date" 
            className="w-full border border-gray-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white transition-all duration-150 outline-none"
            value={localFrom}
            onChange={(e) => { 
              const v = e.target.value; 
              setLocalFrom(v); 
              emitChange(v, localTo); 
            }} 
          />
        </div>

        {/* To Date Input */}
        <div className="flex-1 min-w-[120px]">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-500" strokeWidth={2} />
            To
          </label>
          <input 
            type="date" 
            className="w-full border border-gray-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white transition-all duration-150 outline-none"
            value={localTo}
            onChange={(e) => { 
              const v = e.target.value; 
              setLocalTo(v); 
              emitChange(localFrom, v); 
            }} 
          />
        </div>

        {/* Refresh Button */}
        <Button 
          className="flex items-center justify-center gap-1.5 bg-orange-600 text-white hover:bg-orange-700 rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:shadow transition-all duration-150 min-w-[90px]" 
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
          Refresh
        </Button>

        {/* Last Updated Info */}
        {lastUpdated && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 w-full sm:w-auto sm:ml-auto">
            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" strokeWidth={2} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span className="text-xs font-medium text-gray-500">
                Updated:
              </span>
              <span className="text-xs font-semibold text-gray-700">
                {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
