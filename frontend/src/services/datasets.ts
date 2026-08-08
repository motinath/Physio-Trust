export interface BuiltinDataset {
  id: string;
  name: string;
  category: string;

  format: string;
  sampling_rate_hz: number;
  num_samples: number;
  duration_sec: number;
  signals: string[];
  description: string;
}

export interface ValidationResult {
  valid: boolean;
  filename: string;
  detected_format: string;
  detected_signals: string[];
  sampling_rate_hz: number;
  num_samples: number;
  duration_sec: number;
  error_message?: string | null;
  processing_stages: {
    Uploaded: boolean;
    Validated: boolean;
    Preprocessed: boolean;
    FeaturesExtracted: boolean;
    AIReady: boolean;
  };
}

export const getBuiltinDatasets = async (): Promise<BuiltinDataset[]> => {
  const res = await fetch('/api/v1/datasets/builtin');
  if (!res.ok) throw new Error('Failed to fetch builtin datasets');
  return res.json();
};

export const validateDatasetFile = async (file: File): Promise<ValidationResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/v1/datasets/validate', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Dataset validation request failed');
  return res.json();
};

export interface DatasetRowSample {
  sample_idx: number;
  time_sec: number;
  raw_ecg: number;
  clean_ecg: number;
  sqi: number;
  status: string;
}

export interface FullDataResponse {
  dataset_id: string;
  total_samples: number;
  sampling_rate_hz: number;
  offset: number;
  limit: number;
  rows: DatasetRowSample[];
}

export const getDatasetFullData = async (
  datasetId: string,
  offset: number = 0,
  limit: number = 100
): Promise<FullDataResponse> => {
  const res = await fetch(`/api/v1/datasets/${datasetId}/data?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch dataset full record data');
  return res.json();
};
