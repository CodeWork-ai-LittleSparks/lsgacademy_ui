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
    <div className="w-full bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        {/* From Date Input */}
        <div className="flex-1 min-w-[105px] sm:min-w-[120px]">
          <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" strokeWidth={2.5} />
            From Date
          </label>
          <div className="relative group">
            <input 
              type="date" 
              className="w-full border-2 border-gray-200 group-hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 bg-white transition-all duration-200 shadow-sm hover:shadow-md outline-none"
              value={localFrom}
              onChange={(e) => { 
                const v = e.target.value; 
                setLocalFrom(v); 
                emitChange(v, localTo); 
              }} 
            />
          </div>
        </div>

        {/* To Date Input */}
        <div className="flex-1 min-w-[105px] sm:min-w-[120px]">
          <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" strokeWidth={2.5} />
            To Date
          </label>
          <div className="relative group">
            <input 
              type="date" 
              className="w-full border-2 border-gray-200 group-hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 bg-white transition-all duration-200 shadow-sm hover:shadow-md outline-none"
              value={localTo}
              onChange={(e) => { 
                const v = e.target.value; 
                setLocalTo(v); 
                emitChange(localFrom, v); 
              }} 
            />
          </div>
        </div>

        {/* Refresh Button */}
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 min-w-[82px] sm:min-w-[90px]" 
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          Refresh
        </Button>

        {/* Last Updated Info */}
        {lastUpdated && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 w-full sm:w-auto sm:ml-auto">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Last Updated:
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
