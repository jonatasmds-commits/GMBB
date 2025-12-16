import React from 'react';
import { Project, ProjectStatus } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Download, Printer, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';

interface ReportsProps {
  projects: Project[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export const Reports: React.FC<ReportsProps> = ({ projects }) => {
  
  // Calculate Stats
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) 
    : 0;
  
  // Data for Store Type Distribution (Pie Chart)
  const typeDistribution = projects.reduce((acc, curr) => {
    const type = curr.storeType || 'Outros';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(typeDistribution).map((key, index) => ({
    name: key,
    value: typeDistribution[key],
    color: COLORS[index % COLORS.length]
  }));

  // Data for Budget by Status (Bar Chart)
  const budgetByStatus = projects.reduce((acc, curr) => {
    const status = curr.status;
    acc[status] = (acc[status] || 0) + (curr.budget || 0);
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(budgetByStatus).map((key) => ({
    name: key,
    amount: budgetByStatus[key]
  }));

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios Gerenciais</h2>
          <p className="text-slate-500">Análise detalhada de performance e investimentos.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500">Investimento Total (Estimado)</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)}
          </p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <TrendingUp size={12} className="mr-1" />
            <span>+12% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500">Progresso Médio Global</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgProgress}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${avgProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500">Distribuição por Tipo</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <PieChartIcon size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{Object.keys(typeDistribution).length} Categorias</p>
          <p className="text-xs text-slate-500 mt-1">Maioria: {pieData.sort((a,b) => b.value - a.value)[0]?.name}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:break-inside-avoid">
        {/* Budget Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Orçamento por Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `R$${value/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Obras por Tipo de Loja</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 print:bg-transparent print:border-black">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Detalhamento Financeiro</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold print:bg-transparent print:border-black">
                <th className="px-6 py-3">Loja</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Orçamento</th>
                <th className="px-6 py-3 text-right">Progresso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-slate-300">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 print:hover:bg-transparent">
                  <td className="px-6 py-3 font-medium text-slate-900">{project.storeName}</td>
                  <td className="px-6 py-3 text-slate-600">{project.storeType}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                       project.status === ProjectStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                       project.status === ProjectStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-200' :
                       'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-slate-700">
                    {project.budget ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.budget) : '-'}
                  </td>
                  <td className="px-6 py-3 text-right text-slate-600">{project.progress}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-900 print:bg-transparent border-t border-slate-200">
              <tr>
                <td className="px-6 py-3" colSpan={3}>TOTAL</td>
                <td className="px-6 py-3 text-right">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)}
                </td>
                <td className="px-6 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};