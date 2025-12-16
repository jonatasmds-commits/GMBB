import React, { useState } from 'react';
import { ProjectStatus, Project } from '../types';
import { analyzeProjectScope } from '../services/geminiService';
import { Upload, Wand2, X, AlertCircle } from 'lucide-react';

interface NewProjectFormProps {
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    storeName: '',
    storeNumber: '',
    title: '',
    description: '',
    storeType: 'Vestuário', // Default
    manager: '',
    startDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIAnalysis = async () => {
    if (!formData.description) return;
    setLoadingAI(true);
    const suggestion = await analyzeProjectScope(formData.description, formData.storeType);
    setAiSuggestion(suggestion);
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: ProjectStatus.ANALYSIS,
      progress: 0,
      documents: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Novo Pedido de Obra</h2>
            <p className="text-sm text-slate-500">Preencha os dados para iniciar o processo de aprovação.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Loja</label>
                <input 
                  required
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  type="text" 
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Ex: Zara Shopping"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número do LUC</label>
                <input 
                  required
                  name="storeNumber"
                  value={formData.storeNumber}
                  onChange={handleChange}
                  type="text" 
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Ex: 104-B"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável Técnico</label>
                <input 
                  required
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  type="text" 
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Nome do Engenheiro/Arquiteto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Previsão de Início</label>
                <input 
                  required
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  type="date" 
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Loja</label>
                <select 
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Vestuário</option>
                  <option>Alimentação (Restaurante/Fast Food)</option>
                  <option>Serviços</option>
                  <option>Quiosque</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título do Projeto</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text" 
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Ex: Reforma do Mezanino e Nova Vitrine"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-slate-700">Descrição Detalhada do Escopo</label>
                <button 
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={!formData.description || loadingAI}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                >
                  <Wand2 size={14} />
                  {loadingAI ? 'Analisando...' : 'Analisar Riscos com IA'}
                </button>
              </div>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4} 
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o que será feito na obra (demolição, elétrica, gesso, piso...)"
              />
            </div>

            {/* AI Suggestion Box */}
            {aiSuggestion && (
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 size={16} className="text-purple-600" />
                  <h4 className="text-sm font-bold text-purple-900">Análise Preliminar da IA</h4>
                </div>
                <div className="prose prose-sm prose-purple max-h-40 overflow-y-auto text-slate-700 text-xs leading-relaxed">
                   <div dangerouslySetInnerHTML={{ __html: aiSuggestion.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            )}
            
            <div className="border-t border-slate-100 pt-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">Próximos Passos</p>
                  <p>Após enviar este formulário, você será redirecionado para a tela de upload de documentos (Projetos em DWG/PDF, RRT/ART e Cronograma).</p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="project-form"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 transition-all"
          >
            Criar Solicitação
          </button>
        </div>
      </div>
    </div>
  );
};