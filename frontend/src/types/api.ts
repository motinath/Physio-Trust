// PhysioTrust Type Safety Layer - Strictly Mirroring Backend Pydantic Schemas

export interface QualityResponse {
  subject_id: string;
  overall_quality_score: number;
  snr_db: number;
  powerline_interference_score: number;
  baseline_drift_score: number;
  entropy_score: number;
  kurtosis_score: number;
  amplitude_stability_score: number;
}

export interface MotionResponse {
  subject_id: string;
  motion_level: string;
  confidence_pct: number;
  vector_magnitude_g: number;
  is_artefact_present: boolean;
}

export interface FusionResponse {
  subject_id: string;
  fused_heart_rate_bpm: number;
  confidence_pct: number;
  ecg_weight: number;
  ppg_weight: number;
  ecg_ppg_delta_bpm: number;
  primary_reliable_sensor: string;
}

export interface TrustResponse {
  subject_id: string;
  trust_score: number;
  confidence_level: string;
  is_reliable: boolean;
  context: string;
  threshold: number;
  explanation: {
    human_readable?: string;
    trust_score?: number;
    context?: string;
    is_reliable?: boolean;
    motion_level?: string;
    sensor_agreement?: number;
    reasons?: string[];
  };
}

export interface BaselineResponse {
  subject_id: string;
  sample_count: number;
  baseline_mean_variance: number;
  baseline_std_variance: number;
}

export interface HealthStateResponse {
  subject_id: string;
  overall_state?: string;
  recovery_score_pct: number;
  stress_score_pct: number;
  fatigue_score_pct: number;
  readiness_score_pct: number;
  sleep_quality: string;
  cardiovascular_load: string;
}

export interface RecommendationResponse {
  subject_id: string;
  recommendations: Array<{
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
  }>;
}

export interface TrendResponse {
  subject_id: string;
  recovery_trend: string;
  hrv_trend: string;
  sleep_trend: string;
  stress_trend: string;
  heart_rate_trend: string;
}

export interface FatigueResponse {
  predicted_fatigue_6h_pct: number;
  fatigue_level: string;
}

export interface RecoveryResponse {
  predicted_tomorrow_recovery_pct: number;
  readiness_level: string;
}

export interface StressForecastResponse {
  predicted_stress_3h_pct: number;
  elevation_level: string;
}

export interface RiskItem {
  risk_level: string;
  risk_category: string;
  description: string;
  confidence: number;
}

export interface RiskResponse {
  subject_id: string;
  risks: RiskItem[];
}

export interface FeatureAttribution {
  feature_name: string;
  importance: number;
  contribution_pct?: number;
  direction?: string;
  value?: number | string;
}

export interface FeatureImportanceResponse {
  subject_id: string;
  feature_attributions: FeatureAttribution[];
}

export interface DashboardSummary {
  subject_id: string;
  stream_connected: boolean;
  baseline_variance: number;
  available_records: string[];
}

export interface HealthResponse {
  status: string;
  version: string;
  available_records: string[];
}

export interface SignalResponse {
  id: string;
  subject_id: string;
  signal_type: string;
  sampling_rate: number;
  duration_seconds: number;
  file_path: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  subject_id: string;
  name: string;
  age: number;
  gender: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_level?: string;
  blood_group?: string;
  medical_history?: string;
  medications?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  device_id?: string;
  device_type?: string;
  battery_pct?: number;
  firmware_version?: string;
  ble_rssi?: number;
  resting_hr_bpm?: number;
  resting_hrv_rmssd?: number;
  spo2_baseline_pct?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  respiration_rate?: number;
  body_temp_c?: number;
  baseline_variance: number;
}


export interface ProcessRequest {
  subject_id: string;
  context: string;
  window_sec?: number;
}

export interface WindowSummary {
  window_index: number;
  reliability_score: number;
  is_reliable: boolean;
  context: string;
  threshold: number;
  reason: string;
}

export interface ProcessResponse {
  subject_id: string;
  total_windows: number;
  acceptance_rate: number;
  personalized_variance_baseline: number;
  windows: WindowSummary[];
}
