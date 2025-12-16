import React from 'react';

export enum ProjectStatus {
  DRAFT = 'Rascunho',
  ANALYSIS = 'Em Análise',
  APPROVED = 'Aprovado',
  IN_PROGRESS = 'Em Obras',
  COMPLETED = 'Concluído',
  BLOCKED = 'Pendência',
}

export interface Project {
  id: string;
  storeName: string;
  storeNumber: string;
  title: string;
  description: string;
  status: ProjectStatus;
  storeType: string;
  startDate: string;
  completionDate?: string;
  budget?: number;
  progress: number; // 0 to 100
  documents: Document[];
  manager: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DWG' | 'IMG';
  uploadDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// User & Permissions Types
export type UserRole = 'Admin' | 'Engenheiro' | 'Lojista' | 'Auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastAccess: string;
}

export interface PermissionGroup {
  category: string;
  permissions: {
    id: string;
    label: string;
    roles: UserRole[];
  }[];
}