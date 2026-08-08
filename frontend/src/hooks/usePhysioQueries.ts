import { useQuery } from '@tanstack/react-query';
import {
  getQuality,
  getMotion,
  getFusion,
  getTrustStatus,
  getBaseline,
} from '../services/trust';
import {
  getHealthState,
  getRecovery,
  getStress,
  getFeatureImportance,
  getFatigue,
  getRisk,
  getRecommendations,
  getTrend,
} from '../services/ai';
import {
  QualityResponse,
  MotionResponse,
  FusionResponse,
  HealthStateResponse,
  RecoveryResponse,
  StressForecastResponse,
  FeatureImportanceResponse,
  FatigueResponse,
  RiskResponse,
  RecommendationResponse,
  TrendResponse,
  BaselineResponse,
  TrustResponse,
} from '../types/api';

export function useQualityQuery(subjectId: string) {
  return useQuery<QualityResponse>({
    queryKey: ['quality', subjectId],
    queryFn: () => getQuality(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useMotionQuery(subjectId: string) {
  return useQuery<MotionResponse>({
    queryKey: ['motion', subjectId],
    queryFn: () => getMotion(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useFusionQuery(subjectId: string) {
  return useQuery<FusionResponse>({
    queryKey: ['fusion', subjectId],
    queryFn: () => getFusion(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useHealthStateQuery(subjectId: string) {
  return useQuery<HealthStateResponse>({
    queryKey: ['healthState', subjectId],
    queryFn: () => getHealthState(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useRecoveryQuery(subjectId: string) {
  return useQuery<RecoveryResponse>({
    queryKey: ['recovery', subjectId],
    queryFn: () => getRecovery(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useStressQuery(subjectId: string) {
  return useQuery<StressForecastResponse>({
    queryKey: ['stress', subjectId],
    queryFn: () => getStress(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useFeatureImportanceQuery(subjectId: string) {
  return useQuery<FeatureImportanceResponse>({
    queryKey: ['featureImportance', subjectId],
    queryFn: () => getFeatureImportance(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useFatigueQuery(subjectId: string) {
  return useQuery<FatigueResponse>({
    queryKey: ['fatigue', subjectId],
    queryFn: () => getFatigue(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useRiskQuery(subjectId: string) {
  return useQuery<RiskResponse>({
    queryKey: ['risk', subjectId],
    queryFn: () => getRisk(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useRecommendationsQuery(subjectId: string) {
  return useQuery<RecommendationResponse>({
    queryKey: ['recommendations', subjectId],
    queryFn: () => getRecommendations(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useTrendQuery(subjectId: string) {
  return useQuery<TrendResponse>({
    queryKey: ['trend', subjectId],
    queryFn: () => getTrend(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useBaselineQuery(subjectId: string) {
  return useQuery<BaselineResponse>({
    queryKey: ['baseline', subjectId],
    queryFn: () => getBaseline(subjectId),
    enabled: Boolean(subjectId),
  });
}

export function useTrustStatusQuery(subjectId: string, context: string = 'clinical') {
  return useQuery<TrustResponse>({
    queryKey: ['trustStatus', subjectId, context],
    queryFn: () => getTrustStatus(subjectId, context),
    enabled: Boolean(subjectId),
  });
}
