export const getQuality = async (subjectId) => {
  const res = await fetch(`/api/v1/quality?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch signal quality');
  return res.json();
};

export const getMotion = async (subjectId) => {
  const res = await fetch(`/api/v1/motion?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch motion status');
  return res.json();
};

export const getFusion = async (subjectId) => {
  const res = await fetch(`/api/v1/fusion?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch sensor fusion');
  return res.json();
};

export const getTrustStatus = async (subjectId, context) => {
  const res = await fetch(`/api/v1/trust?subject_id=${subjectId}&context=${context}`);
  if (!res.ok) throw new Error('Failed to fetch trust status');
  return res.json();
};

export const getBaseline = async (subjectId) => {
  const res = await fetch(`/api/v1/baseline/${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch baseline');
  return res.json();
};

export const getTrustExplanation = async (subjectId) => {
  const res = await fetch(`/api/v1/trust-explanation?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch trust explanation');
  return res.json();
};
