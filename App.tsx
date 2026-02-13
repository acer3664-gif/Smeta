
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { EstimateItem, RenovationProject } from './types.ts';
import { getAiSuggestions } from './geminiService.ts';
import { exportToExcel } from './exportService.ts';
import { ESTIMATE_TEMPLATES } from './templates.ts';
import EstimateTable from './EstimateTable.tsx';
import SummaryCards from './SummaryCards.tsx';
import Visualizer from './Visualizer.tsx';
import Auth from './Auth.tsx';
import { supabase } from './supabase.ts';
import { 
  Sparkles, 
  Download, 
  Plus, 
  LayoutPanelTop, 
  FolderOpen, 
  Trash2, 
  Edit3,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Check,
  PlusCircle,
  Loader2,
  FileCode,
  CloudCheck,
  LogOut,
  User,
  AlertTriangle,
  Hammer,
  Menu,
  X,
  Key
} from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [projects, setProjects] = useState<RenovationProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [aiQuery, setAiQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [projectToDelete, setProjectToDelete] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProjects = async () => {
      setIsInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('last_modified', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedProjects: RenovationProject[] = data.map(p => ({
            id: p.id,
            name: p.name,
            items: p.items,
            aiAdvice: p.ai_advice,
            createdAt: p.created_at,
            lastModified: p.last_modified
          }));
          setProjects(mappedProjects);
          setCurrentProjectId(mappedProjects[0].id);
        } else {
          setProjects([]);
          setCurrentProjectId(null);
        }
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProjects();
  }, [session]);

  const syncToCloud = async (project: RenovationProject) => {
    if (!session?.user?.id) return;
    setIsSyncing(true);
    try {
      // Fix: Corrected property name from project.last_modified to project.lastModified to align with RenovationProject interface
      await supabase
        .from('projects')
        .upsert({
          id: project.id,
          user_id: session.user.id,
          name: project.name,
          items: project.items,
          ai_advice: project.aiAdvice,
          created_at: project.createdAt,
          last_modified: project.lastModified
        });
    } catch (err) {
      console.error('Ошибка синхронизации:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const currentProject = useMemo(() => {
    if (!currentProjectId) return projects[0] || null;
    return projects.find(p => p.id === currentProjectId) || projects[0] || null;
  }, [projects, currentProjectId]);

  const totalAmount = useMemo(() => {
    if (!currentProject) return 0;
    return currentProject.items.reduce((sum, i) => sum + (i.quantity * i.pricePerUnit), 0);
  }, [currentProject]);

  const progress = useMemo(() => {
    if (!currentProject || currentProject.items.length === 0) return 0;
    const filled = currentProject.items.filter(i => i.pricePerUnit > 0 && i.quantity > 0).length;
    return Math.round((filled / currentProject.items.length) * 100);
  }, [currentProject]);

  const notify = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProjects([]);
    setCurrentProjectId(null);
  };

  const createNewProject = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProject: RenovationProject = {
      id: newId,
      name: `Проект #${projects.length + 1}`,
      items: [],
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newId);
    syncToCloud(newProject);
    notify(`Проект создан`);
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  }, [projects.length]);

  const loadProTemplate = useCallback(() => {
    const template = ESTIMATE_TEMPLATES[0];
    const newItems: EstimateItem[] = template.items.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      quantity: 0
    }));
    
    const newId = Math.random().toString(36).substr(2, 9);
    const newProject: RenovationProject = {
      id: newId,
      name: `Смета (Профессиональная)`,
      items: newItems,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newId);
    syncToCloud(newProject);
    notify(`Шаблон загружен`);
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setAiError(null);
    } else {
      alert("Настройка ключей доступна только в среде AI Studio");
    }
  };

  const handleAiSuggest = async () => {
    const cleanPrompt = aiQuery.trim();
    if (!cleanPrompt) return;
    setIsLoading(true);
    setAiError(null);
    try {
      const result = await getAiSuggestions(cleanPrompt);
      const newItems: EstimateItem[] = result.items.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        category: item.category,
        name: item.name,
        unit: item.unit as any,
        quantity: item.quantity,
        pricePerUnit: item.estimatedPrice
      }));
      const newId = Math.random().toString(36).substr(2, 9);
      const newProject: RenovationProject = {
        id: newId,
        name: cleanPrompt.length > 30 ? cleanPrompt.slice(0, 30) + "..." : cleanPrompt,
        items: newItems,
        aiAdvice: result.advice,
        createdAt: Date.now(),
        lastModified: Date.now(),
      };
      setProjects(prev => [newProject, ...prev]);
      setCurrentProjectId(newId);
      setAiQuery('');
      syncToCloud(newProject);
      notify("ИИ подготовил смету!");
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      const errorMsg = err.message || "";
      if (errorMsg.includes("API key not valid") || errorMsg.includes("INVALID_ARGUMENT")) {
        setAiError("Проблема с API-ключом. Пожалуйста, выберите корректный ключ.");
      } else {
        setAiError(`Ошибка: ${errorMsg || "проверьте интернет или попробуйте позже"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = useCallback((itemId: string, updates: Partial<EstimateItem>) => {
    if (!currentProject) return;
    const updatedItems = currentProject.items.map(item => item.id === itemId ? { ...item, ...updates } : item);
    const updatedProject = { ...currentProject, lastModified: Date.now(), items: updatedItems };
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    syncToCloud(updatedProject);
  }, [currentProject]);

  const handleDeleteItem = useCallback((itemId: string) => {
    if (!currentProject) return;
    const updatedProject = { ...currentProject, lastModified: Date.now(), items: currentProject.items.filter(item => item.id !== itemId) };
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    syncToCloud(updatedProject);
  }, [currentProject]);

  const handleRenameCategory = useCallback((oldName: string, newName: string) => {
    if (!currentProject) return;
    const updatedItems = currentProject.items.map(item => item.category === oldName ? { ...item, category: newName } : item);
    const updatedProject = { ...currentProject, lastModified: Date.now(), items: updatedItems };
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    syncToCloud(updatedProject);
  }, [currentProject]);

  const handleDeleteCategory = useCallback((categoryName: string) => {
    if (!currentProject) return;
    const updatedItems = currentProject.items.filter(item => item.category !== categoryName);
    const updatedProject = { ...currentProject, lastModified: Date.now(), items: updatedItems };
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    syncToCloud(updatedProject);
  }, [currentProject]);

  const handleAddItem = useCallback((category: string) => {
    if (!currentProject) return;
    const newItem: EstimateItem = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      name: '', 
      unit: 'м2',
      quantity: 0,
      pricePerUnit: 0
    };
    const updatedProject = { ...currentProject, lastModified: Date.now(), items: [...currentProject.items, newItem] };
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    syncToCloud(updatedProject);
  }, [currentProject]);

  const handleAddCategory = useCallback(() => {
    if (!currentProject) return;
    const currentCategories = Array.from(new Set(currentProject.items.map(i => i.category)));
    const newCategoryName = `Раздел ${currentCategories.length + 1}`;
    handleAddItem(newCategoryName);
    notify("Раздел добавлен");
  }, [currentProject, handleAddItem]);

  if (isInitialLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Подключение...</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {projectToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic">Удалить проект?</h3>
              <p className="text-slate-500 text-sm mb-8">Вы удаляете "{projectToDelete.name}".</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setProjectToDelete(null)} className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 uppercase text-xs">Отмена</button>
                <button onClick={async () => {
                  if (!projectToDelete) return;
                  await supabase.from('projects').delete().eq('id', projectToDelete.id);
                  setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
                  if (currentProjectId === projectToDelete.id) setCurrentProjectId(null);
                  setProjectToDelete(null);
                }} className="flex-1 px-6 py-4 rounded-xl font-bold text-white bg-red-500 uppercase text-xs">Удалить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden no-print"
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 lg:w-80 bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-2xl no-print border-r border-white/5 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg"><LayoutPanelTop size={20} /></div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight uppercase italic leading-none">7<span className="text-blue-500">svn</span></span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">смета</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:text-blue-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <button onClick={createNewProject} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/20 text-sm">
            <PlusCircle size={18} /> НОВАЯ СМЕТА
          </button>
          <button 
            onClick={loadProTemplate} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-[11px] border border-white/10 uppercase tracking-tight"
          >
            <Hammer size={16} className="text-blue-400" /> ПРОФ. ШАБЛОН
          </button>
        </div>
        <div className="px-6 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Проекты</div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
          {projects.map(p => (
            <div 
              key={p.id} 
              onClick={() => {
                setCurrentProjectId(p.id);
                if (window.innerWidth <= 1024) setIsSidebarOpen(false);
              }} 
              className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${currentProject?.id === p.id ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FolderOpen size={16} className={currentProject?.id === p.id ? 'text-blue-400' : 'text-slate-600'} />
                <span className="truncate font-medium text-sm">{p.name}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setProjectToDelete({id: p.id, name: p.name}); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="mt-auto p-4 border-t border-white/5 bg-black/10">
           <div className="flex items-center gap-3 mb-4 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0"><User size={16} /></div>
              <span className="text-xs font-bold text-slate-300 truncate">{session?.user?.email || 'Пользователь'}</span>
           </div>
           <button onClick={handleLogout} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase text-slate-400 flex items-center justify-center gap-2">
              <LogOut size={14} /> Выйти
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-20 no-print">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={18} />
            </button>
            {currentProject && <div className="flex items-center gap-2 overflow-hidden max-w-md">
              <input type="text" value={currentProject.name} onChange={(e) => {
                const updated = {...currentProject, name: e.target.value, lastModified: Date.now()};
                setProjects(prev => prev.map(p => p.id === currentProject.id ? updated : p));
                syncToCloud(updated);
              }} className="bg-transparent border-none focus:ring-0 font-black text-slate-800 text-sm lg:text-lg p-0 truncate" />
              <Edit3 size={14} className="text-slate-300 flex-shrink-0" />
            </div>}
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            {currentProject && (
              <div className="relative">
                <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className="bg-slate-900 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-[10px] lg:text-sm shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Download size={16} className="hidden sm:block" /> ЭКСПОРТ <ChevronDown size={14} className={isExportMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {isExportMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 lg:w-56 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden py-1 animate-in slide-in-from-top-2">
                    <button onClick={() => { exportToExcel(currentProject); setIsExportMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 font-bold text-xs lg:text-sm"><FileSpreadsheet size={18} className="text-green-600" /> Excel</button>
                    <button onClick={() => { setIsExportMenuOpen(false); window.print(); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 font-bold text-xs lg:text-sm"><FileText size={18} className="text-blue-600" /> Печать / PDF</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 lg:mb-10 no-print">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] lg:rounded-[2.5rem] p-5 lg:p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 hidden lg:block">
                  <Hammer size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-end gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2 text-blue-100 text-[10px] font-black uppercase tracking-widest"><Sparkles size={14} /> Умная генерация сметы</div>
                    <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()} placeholder="Например: 'Ремонт кухни 10м2'..." className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 lg:py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition-all text-sm lg:text-base" />
                  </div>
                  <button onClick={handleAiSuggest} disabled={isLoading || !aiQuery.trim()} className="w-full md:w-auto bg-white text-blue-700 font-black px-6 lg:px-8 py-3 lg:py-4 rounded-2xl hover:bg-blue-50 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> СОЗДАТЬ</>}
                  </button>
                </div>
                
                {aiError && (
                  <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-red-400 flex-shrink-0" size={20} />
                      <p className="text-red-100 text-xs font-bold leading-tight">{aiError}</p>
                    </div>
                    {aiError.includes("API-ключ") && (
                      <button 
                        onClick={handleOpenKeyDialog}
                        className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-red-50 transition-all whitespace-nowrap shadow-lg"
                      >
                        <Key size={14} /> Выбрать ключ
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {currentProject ? (
              <div className="space-y-6 lg:space-y-10">
                <div className="no-print"><SummaryCards items={currentProject.items} /></div>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10">
                  <div className="xl:col-span-8 overflow-hidden">
                    <EstimateTable 
                      items={currentProject.items} 
                      onUpdate={handleUpdateItem} 
                      onDelete={handleDeleteItem} 
                      onAdd={handleAddItem} 
                      onRenameCategory={handleRenameCategory}
                      onDeleteCategory={handleDeleteCategory}
                      onAddCategory={handleAddCategory}
                      onReorder={(items) => {
                        const updated = {...currentProject, items};
                        setProjects(prev => prev.map(p => p.id === currentProject.id ? updated : p));
                        syncToCloud(updated);
                      }}
                    />
                    
                    {/* Блок итогов специально для печати / PDF */}
                    <div className="print-only mt-12 border-t-2 border-slate-900 pt-10">
                      <div className="mb-10 page-break-inside-avoid">
                        <Visualizer items={currentProject.items} />
                      </div>
                      <div className="print-total-banner">
                        <span className="text-[10pt] font-black uppercase text-slate-500 block mb-1">Итоговая стоимость всех работ по смете:</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">{totalAmount.toLocaleString()} ₽</span>
                      </div>
                      <div className="mt-10 text-[8pt] text-slate-400 font-medium italic text-center">
                        Смета сформирована в 7svn. Данные носят информационный характер.
                      </div>
                    </div>
                  </div>
                  <aside className="xl:col-span-4 space-y-6 lg:space-y-8 no-print">
                    <Visualizer items={currentProject.items} />
                    <div className="bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/20 blur-3xl"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6 text-[10px] font-black uppercase text-blue-400 tracking-widest">Прогресс заполнения <span>{progress}%</span></div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                          <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{width: `${progress}%`}}></div>
                        </div>
                        <div className="text-3xl lg:text-4xl font-black">{totalAmount.toLocaleString()} ₽</div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Итоговая сумма по работам</p>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-10 lg:p-20 opacity-40">
                <LayoutPanelTop size={64} className="text-slate-300 mb-4" />
                <h3 className="text-lg lg:text-xl font-black text-slate-400 uppercase tracking-tighter italic">Выберите смету или создайте новую</h3>
                <p className="text-slate-400 text-xs lg:text-sm mt-2 max-w-xs">Используйте проф. шаблон для быстрой структуры или ИИ для автозаполнения</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <div className="bg-green-500 p-1 rounded-full"><Check size={14} /></div>
          <span className="font-bold text-xs uppercase tracking-wider">{showToast}</span>
        </div>
      )}
    </div>
  );
};

export default App;
