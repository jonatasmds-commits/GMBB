import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Project, ProjectStatus } from '../types';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const COLORS = {
  [ProjectStatus.APPROVED]: '#10b981', // emerald-500
  [ProjectStatus.IN_PROGRESS]: '#3b82f6', // blue-500
  [ProjectStatus.ANALYSIS]: '#f59e0b', // amber-500
  [ProjectStatus.BLOCKED]: '#ef4444', // red-500
  [ProjectStatus.COMPLETED]: '#64748b', // slate-500
  [ProjectStatus.DRAFT]: '#94a3b8', // slate-400
};

export const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(ProjectStatus).map((key) => {
    const statusLabel = ProjectStatus[key as keyof typeof ProjectStatus];
    return {
      name: statusLabel,
      count: statusCounts[statusLabel] || 0,
      color: COLORS[statusLabel] || '#cbd5e1',
    };
  }).filter(d => d.count > 0);

  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
  const pendingAnalysis = projects.filter(p => p.status === ProjectStatus.ANALYSIS).length;
  const blockedProjects = projects.filter(p => p.status === ProjectStatus.BLOCKED).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Obras em Andamento" 
          value={activeProjects} 
          icon={<Activity className="text-blue-600" size={24} />}
          bg="bg-blue-50"
        />
        <StatCard 
          title="Em Análise Técnica" 
          value={pendingAnalysis} 
          icon={<Clock className="text-amber-600" size={24} />} 
          bg="bg-amber-50"
        />
        <StatCard 
          title="Pendências/Bloqueios" 
          value={blockedProjects} 
          icon={<AlertTriangle className="text-red-600" size={24} />} 
          bg="bg-red-50"
        />
        <StatCard 
          title="Total de Projetos" 
          value={projects.length} 
          icon={<CheckCircle className="text-emerald-600" size={24} />} 
          bg="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Status dos Projetos</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-start space-x-3 pb-3 border-b border-slate-50 last:border-0">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  project.status === ProjectStatus.IN_PROGRESS ? 'bg-blue-500' :
                  project.status === ProjectStatus.BLOCKED ? 'bg-red-500' :
                  'bg-slate-300'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{project.storeName}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{project.title}</p>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{project.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todo o histórico</button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; bg: string }> = ({ title, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>
      {icon}
    </div>
  </div>
);