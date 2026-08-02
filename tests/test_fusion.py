import pytest
from physiotrust.fusion_engine.fusion import MultiSensorFusionEngine
from physiotrust.models.trust_model import TrustScoreAIModel


def test_multi_sensor_fusion():
    fusion_out = MultiSensorFusionEngine.fuse_channels(
        ecg_bpm=72.0,
        ppg_bpm=73.0,
        ecg_sqi=95.0,
        ppg_sqi=90.0,
        is_motion_high=False
    )
    assert fusion_out.fused_heart_rate_bpm == pytest.approx(72.5, abs=0.6)
    assert fusion_out.sensor_agreement.is_in_agreement is True
    assert fusion_out.confidence_pct > 80.0


def test_trust_score_ai_model():
    ai_model = TrustScoreAIModel()
    pred_clean = ai_model.predict_trust(
        snr_db=25.0,
        entropy_score=0.8,
        kurtosis_score=0.8,
        baseline_drift=0.05,
        motion_variance=0.02
    )
    assert pred_clean.trust_score > 0.50
    assert pred_clean.confidence_level in ["HIGH", "MEDIUM"]
