import React, { useState } from 'react';
import { User, UserRole, PermissionGroup } from '../types';
import { Users, Shield, Plus, MoreVertical, Search, Check, X, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full animate-fade-in overflow-hidden">
      {/* Settings Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Configurações do Sistema</h2>
        <p className="text-sm text-slate-500">Gerencie acesso, usuários e permissões da plataforma.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 pt-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={16} />
          Usuários
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`pb-3 pt-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'permissions' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Shield size={16} />
          Permissões de Acesso
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {activeTab === 'users' ? <UserManagement /> : <AccessControl />}
      </div>
    </div>
  );
};

// --- Sub-Component: User Management ---

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'João Silva', email: 'joao.eng@mall.com', role: 'Engenheiro', status: 'Active', lastAccess: 'Hoje, 09:30' },
    { id: '2', name: 'Maria Souza', email: 'maria.admin@mall.com', role: 'Admin', status: 'Active', lastAccess: 'Ontem, 18:00' },
    { id: '3', name: 'Zara Manager', email: 'loja102@zara.com', role: 'Lojista', status: 'Active', lastAccess: '2 dias atrás' },
    { id: '4', name: 'Auditoria Externa', email: 'audit@company.com', role: 'Auditor', status: 'Inactive', lastAccess: '1 semana atrás' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ role: 'Lojista', status: 'Active' });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      status: 'Active',
      lastAccess: 'Nunca',
    };

    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ role: 'Lojista', status: 'Active' });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar usuário..." 
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Adicionar Usuário
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <th className="px-6 py-4">Nome / Email</th>
              <th className="px-6 py-4">Função (Cargo)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Último Acesso</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                    {user.status === 'Active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.lastAccess}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Novo Usuário</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newUser.name || ''}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Corporativo</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newUser.email || ''}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
                <select 
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value="Lojista">Lojista (Tenant)</option>
                  <option value="Engenheiro">Engenheiro / Arquiteto</option>
                  <option value="Admin">Administrador do Shopping</option>
                  <option value="Auditor">Auditor Externo</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Access Control Matrix ---

const AccessControl: React.FC = () => {
  const roles: UserRole[] = ['Admin', 'Engenheiro', 'Lojista', 'Auditor'];
  
  // Initial Mock Data
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([
    {
      category: 'Projetos e Obras',
      permissions: [
        { id: 'view_projects', label: 'Visualizar Obras', roles: ['Admin', 'Engenheiro', 'Lojista', 'Auditor'] },
        { id: 'create_project', label: 'Criar Solicitação', roles: ['Lojista', 'Admin'] },
        { id: 'approve_project', label: 'Aprovar/Rejeitar Etapas', roles: ['Admin', 'Engenheiro'] },
        { id: 'delete_project', label: 'Excluir Registros', roles: ['Admin'] },
      ]
    },
    {
      category: 'Documentação',
      permissions: [
        { id: 'upload_docs', label: 'Upload de Documentos', roles: ['Lojista', 'Engenheiro', 'Admin'] },
        { id: 'validate_docs', label: 'Validar Normas Técnicas', roles: ['Engenheiro', 'Admin'] },
      ]
    },
    {
      category: 'Financeiro & Relatórios',
      permissions: [
        { id: 'view_budget', label: 'Visualizar Orçamentos', roles: ['Admin', 'Auditor', 'Lojista'] },
        { id: 'view_dashboard', label: 'Acesso aos Dashboards', roles: ['Admin', 'Engenheiro', 'Auditor'] },
      ]
    },
    {
      category: 'Sistema',
      permissions: [
        { id: 'manage_users', label: 'Gerenciar Usuários', roles: ['Admin'] },
        { id: 'edit_settings', label: 'Configurações Globais', roles: ['Admin'] },
      ]
    }
  ]);

  const togglePermission = (groupIndex: number, permIndex: number, role: UserRole) => {
    const newGroups = [...permissionGroups];
    const perm = newGroups[groupIndex].permissions[permIndex];
    
    if (perm.roles.includes(role)) {
      perm.roles = perm.roles.filter(r => r !== role);
    } else {
      perm.roles.push(role);
    }
    setPermissionGroups(newGroups);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Matriz de Permissões</h3>
          <p className="text-sm text-slate-500">Defina o que cada perfil pode fazer dentro do portal.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={16} />
          Salvar Alterações
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-sm font-semibold text-slate-700 min-w-[200px]">Ação / Permissão</th>
              {roles.map(role => (
                <th key={role} className="px-4 py-3 text-center">
                  <RoleBadge role={role} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {permissionGroups.map((group, groupIndex) => (
              <React.Fragment key={group.category}>
                {/* Category Header */}
                <tr className="bg-slate-50/50">
                  <td colSpan={roles.length + 1} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    {group.category}
                  </td>
                </tr>
                {/* Permission Rows */}
                {group.permissions.map((perm, permIndex) => (
                  <tr key={perm.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100">
                      {perm.label}
                    </td>
                    {roles.map(role => {
                      const isChecked = perm.roles.includes(role);
                      return (
                        <td key={role} className="px-4 py-3 text-center cursor-pointer" onClick={() => togglePermission(groupIndex, permIndex, role)}>
                          <div className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'bg-white border-slate-300 text-transparent hover:border-blue-400'
                          }`}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const styles = {
    'Admin': 'bg-purple-100 text-purple-700 border-purple-200',
    'Engenheiro': 'bg-blue-100 text-blue-700 border-blue-200',
    'Lojista': 'bg-amber-100 text-amber-700 border-amber-200',
    'Auditor': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${styles[role]}`}>
      {role}
    </span>
  );
};