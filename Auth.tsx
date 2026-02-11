
import React, { useState } from 'react';
import { supabase } from './supabase.ts';
import { Mail, Lock, Loader2, LayoutPanelTop, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Проверьте почту для подтверждения регистрации!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200 mb-6">
            <LayoutPanelTop size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
            Remont<span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Ваш персональный менеджер сметы</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 lg:p-10">
          <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">
            {isSignUp ? 'Создать аккаунт' : 'С возвращением!'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ В СИСТЕМУ'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>
        </div>
        
        <p className="mt-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Безопасное хранение данных в Supabase Cloud
        </p>
      </div>
    </div>
  );
};

export default Auth;
