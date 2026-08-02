import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';

export default function SessionReplayControls({
  selectedRecord,
  availableRecords,
  handleRecordChange,
  isPaused,
  setIsPaused,
  replaySpeed,
  setReplaySpeed
}) {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setSessionTime((prev) => (prev + 1) % 3600);
      }, 1000 / replaySpeed);
    }
    return () => clearInterval(interval);
  }, [isPaused, replaySpeed]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSessionTime(0);
  };

  return (
    <div className="session-replay-bar">
      <div className="session-selector-group">
        <label>ACTIVE PHYSIOLOGICAL SESSION</label>
        <select value={selectedRecord} onChange={handleRecordChange} className="session-select">
          {availableRecords.map((rec) => (
            <option key={rec} value={rec}>
              MIT-BIH Subject Session {rec} (Recorded Stream)
            </option>
          ))}
        </select>
      </div>

      <div className="replay-controls-group">
        <button
          className={`btn ${isPaused ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? 'Play Stream' : 'Pause Stream'}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
          <span>{isPaused ? 'PLAY STREAM' : 'PAUSE'}</span>
        </button>

        <button className="btn btn-secondary" onClick={handleReset} title="Reset Session">
          <RotateCcw size={14} />
          <span>RESET</span>
        </button>

        <div className="speed-toggle-group">
          {[1, 2, 4, 8].map((spd) => (
            <button
              key={spd}
              className={`speed-btn ${replaySpeed === spd ? 'active' : ''}`}
              onClick={() => setReplaySpeed(spd)}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      <div className="replay-time-display">
        <Clock size={14} className="time-icon" />
        <span className="time-val">{formatTime(sessionTime)}</span>
        <span className="time-total">/ 60:00</span>
      </div>
    </div>
  );
}
