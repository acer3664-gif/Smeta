
import React, { useState } from 'react';
import { EstimateItem, UnitType } from '../types.ts';
import { Trash2, Plus, GripVertical, PlusCircle, Edit2, X, AlertTriangle } from 'lucide-react';

interface Props {
  items: EstimateItem[];
  onUpdate: (id: string, updates: Partial<EstimateItem>) => void;
  onDelete: (id: string) => void;
  onAdd: (category: string) => void;
  onAddCategory: () => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  onReorder?: (items: EstimateItem[]) => void;
}

const UNITS: UnitType[] = ['м2', 'м/п', 'шт', 'упак', 'компл', 'кг', 'л', 'точка', 'ветка'];

const EstimateTable: React.FC<Props> = ({ 
  items, onUpdate, onDelete, onAdd, onAddCategory, onRenameCategory, onDeleteCategory, onReorder 
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');
  const [categoryToRemove, setCategoryToRemove] = useState<string | null>(null);

  const categories = Array.from(new Set<string>(items.map(item => item.category))).sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId || !onReorder) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(i => i.id === draggedId);
    const targetIndex = newItems.findIndex(i => i.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = newItems.splice(draggedIndex, 1);
      removed.category = newItems[targetIndex < draggedIndex ? targetIndex : targetIndex - 1]?.category || removed.category;
      newItems.splice(targetIndex, 0, removed);
      onReorder(newItems);
    }
  };

  const startRename = (name: string) => {
    setEditingCategory(name);
    setTempCategoryName(name);
  };

  const saveRename = () => {
    if (editingCategory && tempCategoryName.trim() && tempCategoryName !== editingCategory) {
      onRenameCategory(editingCategory, tempCategoryName.trim());
    }
    setEditingCategory(null);
  };

  const confirmDeleteCategory = () => {
    if (categoryToRemove) {
      onDeleteCategory(categoryToRemove);
      setCategoryToRemove(null);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Модальное окно подтверждения удаления раздела */}
      {categoryToRemove && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Удалить раздел?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Раздел <span className="font-bold text-slate-900">"{categoryToRemove}"</span> и все позиции в нем будут удалены навсегда.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setCategoryToRemove(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-xs uppercase tracking-widest"
                >
                  Отмена
                </button>
                <button 
                  onClick={confirmDeleteCategory}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100 text-xs uppercase tracking-widest"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-lg mb-6">Смета пока пуста</p>
          <button 
            onClick={onAddCategory}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> СОЗДАТЬ ПЕРВЫЙ РАЗДЕЛ
          </button>
        </div>
      )}
      
      {categories.map(category => (
        <div key={category} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md print-section-container">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex justify-between items-center group/cat">
            <div className="flex items-center gap-3 flex-1 mr-4">
              {editingCategory === category ? (
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input
                    autoFocus
                    type="text"
                    value={tempCategoryName}
                    onChange={(e) => setTempCategoryName(e.target.value)}
                    onBlur={saveRename}
                    onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                    className="bg-white border-2 border-blue-500 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 w-full outline-none"
                  />
                </div>
              ) : (
                <>
                  <h3 
                    onClick={() => startRename(category)}
                    className="font-black text-slate-800 text-base cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    {category}
                    <Edit2 size={12} className="opacity-0 group-hover/cat:opacity-100 text-slate-400 no-print" />
                  </h3>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] no-print">Раздел</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryToRemove(category);
                }}
                className="opacity-0 group-hover/cat:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all no-print"
                title="Удалить раздел целиком"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-white text-slate-400 text-[10px] uppercase tracking-[0.15em] border-b border-slate-100 font-bold">
                  <th className="px-6 py-4 w-auto">Наименование</th>
                  <th className="px-1 py-4 text-center w-20">Ед.изм.</th>
                  <th className="px-1 py-4 text-center w-16">Кол-во</th>
                  <th className="px-3 py-4 text-center w-24">Цена (₽)</th>
                  <th className="px-6 py-4 text-right w-32">Сумма (₽)</th>
                  <th className="px-3 w-12 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.filter(i => i.category === category).map(item => (
                  <tr 
                    key={item.id} 
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.id)}
                    className={`hover:bg-blue-50/30 transition-colors group cursor-default ${draggedId === item.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="px-6 py-3.5 overflow-hidden">
                      <div className="flex items-center gap-2" title={item.name}>
                        <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-blue-500 transition-colors flex-shrink-0 no-print">
                          <GripVertical size={14} />
                        </div>
                        <input
                          type="text"
                          value={item.name}
                          placeholder="Введите наименование..."
                          title={item.name}
                          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                          className="w-full bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 rounded px-1.5 py-1 -mx-1.5 transition-all text-slate-700 text-sm truncate"
                        />
                      </div>
                    </td>
                    <td className="px-1 py-3.5 text-center">
                      <select
                        value={item.unit}
                        onChange={(e) => onUpdate(item.id, { unit: e.target.value as UnitType })}
                        className="bg-transparent border-none focus:ring-0 text-[13px] cursor-pointer text-slate-500 font-medium w-full text-center p-0"
                      >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                    <td className="px-1 py-3.5">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity || ''}
                        placeholder="0"
                        onWheel={handleWheel}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          // Используем Math.max(0, val) для исключения отрицательных чисел и -0
                          onUpdate(item.id, { quantity: isNaN(val) ? 0 : Math.max(0, val) });
                        }}
                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-100 rounded py-1 transition-all text-slate-700 text-[13px]"
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <input
                        type="number"
                        value={item.pricePerUnit || ''}
                        placeholder="0"
                        onWheel={handleWheel}
                        onChange={(e) => onUpdate(item.id, { pricePerUnit: parseFloat(e.target.value) || 0 })}
                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-100 rounded py-1 transition-all text-slate-700 font-semibold text-[13px]"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-right font-black text-slate-900 whitespace-nowrap text-sm">
                      {(item.quantity * item.pricePerUnit).toLocaleString()} ₽
                    </td>
                    <td className="px-3 py-3.5 text-right no-print">
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg"
                        title="Удалить строку"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50/20 group/add no-print">
                  <td colSpan={6} className="px-6 py-3">
                    <button 
                      onClick={() => onAdd(category)}
                      className="flex items-center gap-2 text-blue-600 font-bold text-[13px] hover:text-blue-700 transition-colors w-full justify-start p-1.5 rounded-lg hover:bg-blue-50/50"
                    >
                      <PlusCircle size={16} />
                      Добавить позицию в раздел
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/30">
                  <td colSpan={4} className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Итого по разделу:</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 whitespace-nowrap text-base">
                    {items.filter(i => i.category === category)
                      .reduce((sum, i) => sum + (i.quantity * i.pricePerUnit), 0)
                      .toLocaleString()} ₽
                  </td>
                  <td className="no-print"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}

      {categories.length > 0 && (
        <div className="flex justify-center pt-6 no-print">
          <button 
            onClick={onAddCategory}
            className="flex items-center gap-3 bg-white border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-100 active:scale-95 group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            ДОБАВИТЬ НОВЫЙ РАЗДЕЛ РАБОТ
          </button>
        </div>
      )}
    </div>
  );
};

export default EstimateTable;
