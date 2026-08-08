export const getPredictions = async (subjectId) => {
  const res = await fetch(`/api/v1/prediction?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch predictions');
  return res.json();
};

export const getForecast = async (subjectId) => {
  const res = await fetch(`/api/v1/forecast?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch forecasts');
  return res.json();
};

export const getFatigue = async (subjectId) => {
  const res = await fetch(`/api/v1/fatigue?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch fatigue prediction');
  return res.json();
};

export const getRecovery = async (subjectId) => {
  const res = await fetch(`/api/v1/recovery?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch recovery prediction');
  return res.json();
};

export const getStress = async (subjectId) => {
  const res = await fetch(`/api/v1/stress?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch stress forecast');
  return res.json();
};

export const getRisk = async (subjectId) => {
  const res = await fetch(`/api/v1/risk?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch risk radar');
  return res.json();
};

export const getWarnings = async (subjectId) => {
  const res = await fetch(`/api/v1/warnings?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch early warnings');
  return res.json();
};

export const getSimulation = async (subjectId) => {
  const res = await fetch(`/api/v1/simulation?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch simulations');
  return res.json();
};

export const getPredictiveRecommendation = async (subjectId) => {
  const res = await fetch(`/api/v1/predictive-recommendation?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch predictive recommendations');
  return res.json();
};

export const getExplanation = async (subjectId) => {
  const res = await fetch(`/api/v1/explanation?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch explanations');
  return res.json();
};

export const getConfidence = async (subjectId) => {
  const res = await fetch(`/api/v1/confidence?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch confidence report');
  return res.json();
};

export const getFeatureImportance = async (subjectId) => {
  const res = await fetch(`/api/v1/feature-importance?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch feature importance');
  return res.json();
};

export const getReasoning = async (subjectId) => {
  const res = await fetch(`/api/v1/reasoning?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch reasoning chain');
  return res.json();
};

export const getRecommendationExplanation = async (subjectId) => {
  const res = await fetch(`/api/v1/recommendation-explanation?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch recommendation explanation');
  return res.json();
};

export const getCircadianProfile = async (subjectId) => {
  const res = await fetch(`/api/v1/circadian?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch circadian rhythm');
  return res.json();
};

export const getHealthMemory = async (subjectId) => {
  const res = await fetch(`/api/v1/memory?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch health memory');
  return res.json();
};

export const getHealthState = async (subjectId) => {
  const res = await fetch(`/api/v1/health-state?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch health state');
  return res.json();
};

export const getRecommendations = async (subjectId) => {
  const res = await fetch(`/api/v1/recommendations?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
};

export const getTrend = async (subjectId) => {
  const res = await fetch(`/api/v1/trend?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch trend intelligence');
  return res.json();
};
