import React from 'react';
import { Check } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function CalendarLegend() {
  const { filters, toggleFilter } = useTasks();

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3 select-none">
      {/* Công việc chủ động */}
      <div
        onClick={() => toggleFilter('chuDong')}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
              filters.chuDong
                ? 'bg-[#5151e6] text-white shadow-xs'
                : 'border border-gray-300 bg-white group-hover:border-indigo-400'
            }`}
          >
            {filters.chuDong && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            Công việc chủ động
          </span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
      </div>

      {/* Thiết yếu / Bị động */}
      <div
        onClick={() => toggleFilter('biDong')}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
              filters.biDong
                ? 'bg-[#f97316] text-white shadow-xs'
                : 'border border-gray-300 bg-white group-hover:border-orange-400'
            }`}
          >
            {filters.biDong && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            Thiết yếu / Bị động
          </span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]" />
      </div>

      {/* Đã hoàn thành */}
      <div
        onClick={() => toggleFilter('daHoanThanh')}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
              filters.daHoanThanh
                ? 'bg-[#10b981] text-white shadow-xs'
                : 'border border-gray-300 bg-white group-hover:border-emerald-400'
            }`}
          >
            {filters.daHoanThanh && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            Đã hoàn thành
          </span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
      </div>
    </div>
  );
}
