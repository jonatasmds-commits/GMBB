import React from 'react';
import { LayoutDashboard, FolderKanban, FileText, Settings, HelpCircle, Building2, LogOut, PieChart } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, currentUser, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'projects', icon: FolderKanban, label: 'Minhas Obras' },
    { id: 'reports', icon: PieChart, label: 'Relatórios' },
    { id: 'documents', icon: FileText, label: 'Documentação' },
    { id: 'guidelines', icon: HelpCircle, label: 'Normas & Manuais' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col print:hidden`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Building2 className="text-blue-600 mr-2" size={28} />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">MallWorks</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">PORTAL DE OBRAS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon 
                size={20} 
                className={`mr-3 transition-colors ${
                  activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} 
              />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-3 bg-slate-50 rounded-xl mb-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
               currentUser?.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
             }`}>
               {currentUser ? getInitials(currentUser.name) : 'G'}
             </div>
             <div className="ml-3 overflow-hidden">
               <p className="text-xs font-semibold text-slate-800 truncate">{currentUser?.name || 'Convidado'}</p>
               <p className="text-[10px] text-slate-500 truncate">{currentUser?.role || 'Visitante'}</p>
             </div>
             <button 
               onClick={onLogout}
               className="ml-auto text-slate-400 hover:text-red-500 transition-colors p-1"
               title="Sair"
             >
               <LogOut size={16} />
             </button>
          </div>
        </div>
      </div>
    </>
  );
};