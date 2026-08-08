import { create } from 'zustand';

export type WorkspaceType = 'research' | 'personal' | 'clinical' | 'admin';
export type ActivityContextType = 'rest' | 'sleep' | 'walking' | 'running';

export interface DiagnosticReport {
  id: string;
  subjectId: string;
  timestamp: string;
  datasetName: string;
  trustScore: number;
  qualityScore: number;
  confidencePct: number;
  fusedBpm: number;
  healthState: string;
  fatiguePct: number;
  recoveryPct: number;
  stressPct: number;
  riskLevel: string;
  snrDb: number;
  motionLevel: string;
  explanation: string;
  recommendations: string[];
}

interface AppState {
  activeWorkspace: WorkspaceType;
  activeTab: string;
  theme: 'dark' | 'light';
  selectedRecord: string;
  executedRecord: string | null;
  context: ActivityContextType;
  threshold: number;
  isLoggedIn: boolean;
  username: string;
  authToken: string | null;
  streamConnected: boolean;
  reportsHistory: DiagnosticReport[];

  setActiveWorkspace: (ws: WorkspaceType) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSelectedRecord: (record: string) => void;
  setExecutedRecord: (record: string | null) => void;
  clearExecutedRecord: () => void;
  setContext: (context: ActivityContextType) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUsername: (username: string) => void;
  setAuthToken: (token: string | null) => void;
  setStreamConnected: (connected: boolean) => void;
  addReport: (report: DiagnosticReport) => void;
}

const threshMap: Record<ActivityContextType, number> = {
  rest: 0.60,
  sleep: 0.70,
  walking: 0.40,
  running: 0.30,
};

export const useAppStore = create<AppState>((set) => ({
  activeWorkspace: 'research',
  activeTab: 'dashboard',
  theme: 'light',
  selectedRecord: '',
  executedRecord: null,
  context: 'rest',
  threshold: 0.60,
  isLoggedIn: true,
  username: 'Motinath',
  authToken: null,
  streamConnected: false,
  reportsHistory: [],

  setActiveWorkspace: (ws) => set({ activeWorkspace: ws, activeTab: 'dashboard' }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setSelectedRecord: (record) => set({ selectedRecord: record, executedRecord: null }),
  setExecutedRecord: (record) => set({ executedRecord: record }),
  clearExecutedRecord: () => set({ executedRecord: null }),
  setContext: (context) => set({ context, threshold: threshMap[context] || 0.50 }),
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setUsername: (username) => set({ username }),
  setAuthToken: (token) => set({ authToken: token }),
  setStreamConnected: (connected) => set({ streamConnected: connected }),
  addReport: (report) => set((state) => ({
    reportsHistory: [report, ...state.reportsHistory.filter((r) => r.id !== report.id)],
  })),
}));
