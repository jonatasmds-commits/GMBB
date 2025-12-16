import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { Search, Filter, MoreVertical, FileText } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredProjects = projects.filter(p => {
    const matchesText = p.storeName.toLowerCase().includes(filter.toLowerCase()) || 
                        p.title.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesText && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full animate-fade-in">
      {/* Header / Toolbar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-800">Gerenciar Obras</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar loja ou projeto..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Todos os Status</option>
              {Object.values(ProjectStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Loja / Unidade</th>
              <th className="px-6 py-4">Projeto</th>
              <th className="px-6 py-4">Responsável</th>
              <th className="px-6 py-4">Progresso</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onSelectProject(project)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                      {project.storeNumber}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{project.storeName}</p>
                      <p className="text-xs text-slate-500">LUC {project.storeNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-slate-800 font-medium truncate">{project.title}</p>
                    <p className="text-xs text-slate-500">Início: {project.startDate}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{project.manager}</p>
                </td>
                <td className="px-6 py-4 w-48">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>Nenhum projeto encontrado com os filtros atuais.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const styles = {
    [ProjectStatus.APPROVED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [ProjectStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200',
    [ProjectStatus.ANALYSIS]: 'bg-amber-100 text-amber-700 border-amber-200',
    [ProjectStatus.BLOCKED]: 'bg-red-100 text-red-700 border-red-200',
    [ProjectStatus.COMPLETED]: 'bg-slate-100 text-slate-700 border-slate-200',
    [ProjectStatus.DRAFT]: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};