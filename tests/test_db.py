import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.db.session import Base
from backend.app.services.user_service import get_or_create_user, list_users, update_user_baseline
from backend.app.services.signal_service import create_signal_record, list_signal_records, store_trust_record


@pytest.fixture(scope="module")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_user_crud(db_session):
    user = get_or_create_user(db_session, subject_id="100", name="MIT-BIH Subject 100", age=69, gender="male")
    assert user.id is not None
    assert user.subject_id == "100"

    users = list_users(db_session)
    assert len(users) >= 1

    updated = update_user_baseline(db_session, subject_id="100", baseline_variance=0.9984)
    assert updated.baseline_variance == 0.9984


def test_signal_crud(db_session):
    user = get_or_create_user(db_session, subject_id="100")
    sig = create_signal_record(db_session, user_id=user.id, signal_type="ECG", raw_signal=[0.1, 0.2, 0.3], sampling_rate=360.0)
    assert sig.signal_id is not None
    assert sig.user_id == user.id

    records = list_signal_records(db_session)
    assert len(records) >= 1

    trust_rec = store_trust_record(db_session, signal_id=sig.signal_id, quality_score=100.0, trust_score=0.97, explanation="Clean ECG", quality_metrics={"entropy": 0.5})
    assert trust_rec.id is not None
    assert trust_rec.trust_score == 0.97
