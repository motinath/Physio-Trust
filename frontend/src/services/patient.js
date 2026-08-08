export const getUsers = async () => {
  const res = await fetch('/api/v1/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const getUser = async (subjectId) => {
  const res = await fetch(`/api/v1/users/${subjectId}`);
  if (!res.ok) throw new Error(`Failed to fetch user for subject ${subjectId}`);
  return res.json();
};


export const createUser = async (userData) => {
  const res = await fetch('/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
};

export const getProfile = async (subjectId) => {
  const res = await fetch(`/api/v1/profile?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const getReports = async (subjectId) => {
  const res = await fetch(`/api/v1/reports?subject_id=${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
};

export const createReport = async (reportData) => {
  const query = new URLSearchParams(reportData).toString();
  const res = await fetch(`/api/v1/reports?${query}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to create report');
  return res.json();
};
