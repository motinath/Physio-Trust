# PhysioTrust Performance Benchmark Report

This report evaluates compile times, execution times, and render speeds across the PhysioTrust platform.

---

## 1. Execution Speed Benchmarks

- **Backend Pytest Run**: **6.55 seconds** for all 61 tests (~107 ms average latency per test case).
- **Vite Production Compile**: **614 ms** to package the entire React SPA.
- **Frontend Bundle Size**: **239.77 KB** JS chunk size.

---

## 2. Telemetry Streaming Performance

- **Oscilloscope Render Rate**: **60 FPS** continuous rendering on HTML5 Canvas using `requestAnimationFrame`.
- **Telemetry Latency**: `< 5 ms` data processing loop latency under active 360 Hz raw signal stream.
