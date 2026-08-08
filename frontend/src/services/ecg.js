export const getSignals = async () => {
  const res = await fetch('/api/v1/signals');
  if (!res.ok) throw new Error('Failed to fetch signals');
  return res.json();
};

export const postSignal = async (signalData) => {
  const res = await fetch('/api/v1/signals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signalData)
  });
  if (!res.ok) throw new Error('Failed to post signal');
  return res.json();
};

export const getWaveform = async (subjectId, windowIdx) => {
  const res = await fetch(`/api/v1/waveform?subject_id=${subjectId}&window_idx=${windowIdx}`);
  if (!res.ok) throw new Error('Failed to fetch waveform');
  return res.json();
};

export const processSignal = async (payload) => {
  const res = await fetch('/api/v1/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to process signal');
  return res.json();
};
