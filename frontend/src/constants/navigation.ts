import {
  LayoutGrid,
  Database,
  Activity,
  Brain,
  Shield,
  BarChart3,
  FileText,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

export const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'datasets', label: 'Datasets', icon: Database },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'ai_intelligence', label: 'AI Intelligence', icon: Brain },
  { id: 'trust_engine', label: 'Trust Engine', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
];
