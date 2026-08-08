export const getDashboardSummary = async (subjectId) => {
  const res = await fetch(`/api/v1/dashboard?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
};

export const getHealthStatus = async () => {
  const res = await fetch('/api/v1/health');
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
};

export const getSystemHealth = async () => {
  const res = await fetch('/api/v1/monitoring/health');
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
};

export const getDemoStatus = async () => {
  const res = await fetch('/api/v1/demo/status');
  if (!res.ok) throw new Error('Failed to fetch demo status');
  return res.json();
};

export const getResearchExperiments = async () => {
  const res = await fetch('/api/v1/research/experiments');
  if (!res.ok) throw new Error('Failed to fetch research experiments');
  return res.json();
};
