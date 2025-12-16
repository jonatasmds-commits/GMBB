import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@mallworks.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (email === 'admin@mallworks.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          name: 'Administrador Principal',
          email: 'admin@mallworks.com',
          role: 'Admin',
          status: 'Active',
          lastAccess: new Date().toISOString()
        };
        onLogin(adminUser);
      } else if (email === 'eng@mallworks.com' && password === 'eng123') {
        const engUser: User = {
          id: '2',
          name: 'João Engenheiro',
          email: 'eng@mallworks.com',
          role: 'Engenheiro',
          status: 'Active',
          lastAccess: new Date().toISOString()
        };
        onLogin(engUser);
      } else {
        setError('Credenciais inválidas. Tente novamente.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        
        {/* Header / Logo */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-12 translate-y-1/2"></div>
          <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">MallWorks</h1>
          <p className="text-blue-100 text-sm">Portal de Gestão de Obras</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Acessando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo Hints */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center uppercase tracking-wider font-semibold mb-3">Acesso de Demonstração</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 grid gap-1">
              <div className="flex justify-between">
                <span className="font-semibold text-blue-600">Admin:</span>
                <span className="font-mono">admin@mallworks.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Senha:</span>
                <span className="font-mono">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};