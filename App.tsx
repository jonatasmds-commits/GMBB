import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { AIChat } from './components/AIChat';
import { NewProjectForm } from './components/NewProjectForm';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Project, ProjectStatus, User } from './types';
import { Menu, Plus, Bell } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  // Mock Data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      storeName: 'Zara',
      storeNumber: '102',
      title: 'Expansão do Mezanino',
      description: 'Reforma completa do segundo piso com nova iluminação e piso.',
      status: ProjectStatus.IN_PROGRESS,
      storeType: 'Vestuário',
      progress: 65,
      budget: 450000,
      startDate: '2023-10-15',
      manager: 'Ana Costa',
      documents: [],
    },
    {
      id: '2',
      storeName: 'Starbucks',
      storeNumber: 'KIOSK-04',
      title: 'Instalação Hidráulica',
      description: 'Adequação de ponto de água e esgoto para nova máquina.',
      status: ProjectStatus.ANALYSIS,
      storeType: 'Alimentação',
      progress: 10,
      budget: 25000,
      startDate: '2023-11-01',
      manager: 'Carlos Oliveira',
      documents: [],
    },
    {
      id: '3',
      storeName: 'Livraria Cultura',
      storeNumber: '205',
      title: 'Troca de Vitrine',
      description: 'Substituição dos vidros frontais e pintura.',
      status: ProjectStatus.APPROVED,
      storeType: 'Serviços',
      progress: 0,
      budget: 85000,
      startDate: '2023-11-20',
      manager: 'Roberto Dias',
      documents: [],
    },
    {
      id: '4',
      storeName: 'Cinema Multiplex',
      storeNumber: '400',
      title: 'Reforma Sala 3',
      description: 'Troca de carpetes e poltronas.',
      status: ProjectStatus.BLOCKED,
      storeType: 'Lazer',
      progress: 30,
      budget: 120000,
      startDate: '2023-09-10',
      manager: 'Fernanda Lima',
      documents: [],
    },
    {
      id: '5',
      storeName: 'Gelato Italia',
      storeNumber: 'KIOSK-12',
      title: 'Novo Quiosque',
      description: 'Instalação completa de quiosque padrão.',
      status: ProjectStatus.COMPLETED,
      storeType: 'Alimentação',
      progress: 100,
      budget: 60000,
      startDate: '2023-08-01',
      manager: 'Pedro Santos',
      documents: [],
    }
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleNewProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      storeName: projectData.storeName || 'Nova Loja',
      storeNumber: projectData.storeNumber || '000',
      title: projectData.title || 'Sem título',
      description: projectData.description || '',
      status: ProjectStatus.ANALYSIS,
      storeType: projectData.storeType || 'Outros',
      progress: 0,
      budget: 0, // Default budget for new requests
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      manager: projectData.manager || 'N/A',
      documents: [],
    };
    
    setProjects([newProject, ...projects]);
    setShowNewProjectModal(false);
    setActiveTab('projects');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 print:hidden">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="mr-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
              {activeTab === 'dashboard' ? 'Visão Geral' : 
               activeTab === 'projects' ? 'Minhas Obras' : 
               activeTab === 'reports' ? 'Relatórios Gerenciais' : 
               activeTab === 'documents' ? 'Documentos' : 'Configurações'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nova Solicitação</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 print:p-0 print:bg-white">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <Dashboard projects={projects} />}
            {activeTab === 'projects' && <ProjectList projects={projects} onSelectProject={(p) => console.log(p)} />}
            {activeTab === 'reports' && <Reports projects={projects} />}
            {activeTab === 'settings' && <Settings />}
            
            {/* Placeholders for other tabs */}
            {activeTab === 'documents' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Menu size={32} className="opacity-20" />
                 </div>
                 <p>Módulo de documentos em desenvolvimento</p>
              </div>
            )}
            
            {activeTab === 'guidelines' && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <p>Normas e Manuais</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals & Floating Elements */}
      {showNewProjectModal && (
        <NewProjectForm 
          onClose={() => setShowNewProjectModal(false)} 
          onSubmit={handleNewProject}
        />
      )}
      
      <div className="print:hidden">
        <AIChat />
      </div>
      
    </div>
  );
};

export default App;