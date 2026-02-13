
import React from 'react';
import { EstimateItem } from '../types.ts';

interface Props {
  items: EstimateItem[];
}

const COLORS = [
  '#2563eb', // blue-600
  '#3b82f6', // blue-500
  '#60a5fa', // blue-400
  '#93c5fd', // blue-300
  '#1d4ed8', // blue-700
  '#1e40af', // blue-800
  '#1e3a8a', // blue-900
  '#6366f1', // indigo-500
  '#818cf8', // indigo-400
  '#4f46e5', // indigo-600
];

const Visualizer: React.FC<Props> = ({ items }) => {
  const categoryTotals = items.reduce((acc: any, item) => {
    const total = item.quantity * item.pricePerUnit;
    if (total > 0) {
      acc[item.category] = (acc[item.category] || 0) + total;
    }
    return acc;
  }, {});

  const totalValue = Object.values(categoryTotals).reduce((sum: number, val: any) => sum + val, 0) as number;

  const data = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat] as number,
    percent: totalValue > 0 ? ((categoryTotals[cat] as number) / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm mb-10 flex flex-col print:border-none print:p-0 print:mb-0 print:rounded-none">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 print:mb-3 print:text-[8pt]">Распределение затрат по разделам</h3>
      
      {/* Сегментированная полоса */}
      <div className="w-full h-10 bg-slate-100 rounded-2xl flex overflow-hidden mb-8 shadow-inner print:h-6 print:mb-4 print:rounded-lg print:border print:border-slate-200">
        {data.map((entry, index) => (
          <div 
            key={`segment-${entry.name}`}
            style={{ width: `${entry.percent}%`, backgroundColor: COLORS[index % COLORS.length] }}
            className="h-full transition-all duration-500 hover:brightness-110 cursor-pointer relative group print:!opacity-100"
            title={`${entry.name}: ${entry.value.toLocaleString()} ₽ (${entry.percent.toFixed(1)}%)`}
          >
            {/* Тултип при наведении на сегмент - скрываем при печати */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-bold no-print">
              {entry.name}: {entry.percent.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Список наименований в столбик */}
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 print:max-h-none print:gap-1.5 print:grid print:grid-cols-2 print:pr-0">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between group py-1 print:py-0.5 print:border-b print:border-slate-50">
            <div className="flex items-center gap-3 overflow-hidden print:gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm transition-transform group-hover:scale-125 print:w-2 print:h-2 print:!opacity-100" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-slate-700 font-bold text-xs truncate print:text-[8pt] print:leading-tight" title={entry.name}>
                  {entry.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium print:text-[7pt]">
                  {entry.percent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 ml-2">
              <span className="text-slate-900 font-black text-xs print:text-[8pt]">
                {entry.value.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visualizer;
