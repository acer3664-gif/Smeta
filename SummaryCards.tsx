
import React from 'react';
import { EstimateItem } from '../types.ts';
import { Wallet, Calculator, PieChart } from 'lucide-react';

interface Props {
  items: EstimateItem[];
}

const SummaryCards: React.FC<Props> = ({ items }) => {
  const total = items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const categoriesCount = new Set(items.map(i => i.category)).size;
  const itemsCount = items.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-4 mb-5">
          <div className="bg-blue-500 p-3 rounded-xl shadow-inner">
            <Wallet size={24} />
          </div>
          <span className="text-blue-100 font-semibold text-lg">Итоговая стоимость</span>
        </div>
        <div className="text-4xl font-black tracking-tight">{total.toLocaleString()} ₽</div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-4 mb-5 text-slate-500">
          <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
            <Calculator size={24} />
          </div>
          <span className="font-semibold text-lg text-slate-600">Позиций в смете</span>
        </div>
        <div className="text-4xl font-black text-slate-900 tracking-tight">{itemsCount}</div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-4 mb-5 text-slate-500">
          <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
            <PieChart size={24} />
          </div>
          <span className="font-semibold text-lg text-slate-600">Разделов работ</span>
        </div>
        <div className="text-4xl font-black text-slate-900 tracking-tight">{categoriesCount}</div>
      </div>
    </div>
  );
};

export default SummaryCards;
