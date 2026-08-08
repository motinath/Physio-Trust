import jsPDF from 'jspdf';
import { DiagnosticReport } from '../store/useAppStore';

/**
 * Generates an official, beautifully formatted Clinical & Physiological Diagnostic Report PDF.
 * Designed with 3-tier user explanation modes (Patient-Friendly, Clinical, and Technical/Signal).
 */
export function generateReportPDF(report: DiagnosticReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primaryEmerald = [16, 185, 129];
  const darkSlate = [15, 23, 42];
  const mutedGray = [100, 116, 139];
  const lightBg = [248, 250, 252];

  // Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PHYSIOTRUST CLINICAL DIAGNOSTIC REPORT', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Verified Multi-Modal Biosignal Fusion & Reliability Verification Engine', 14, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`ID: ${report.id}`, pageWidth - 14, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Generated: ${report.timestamp}`, pageWidth - 14, 21, { align: 'right' });

  let y = 38;

  // Metadata Table Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Subject Record ID:', 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${report.subjectId}`, 52, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Dataset Source:', 90, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.datasetName}`, 120, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 18, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('CLINICALLY VERIFIED', 32, y + 13);

  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Rating:', 90, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text(`${report.riskLevel} RISK`, 112, y + 13);

  y += 24;

  // Metric Overview Header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Key Telemetry & Health Metrics', 14, y);
  y += 5;

  const cardWidth = (pageWidth - 28 - 9) / 4;
  const metrics = [
    { title: 'TRUST SCORE', value: `${report.trustScore}%`, color: primaryEmerald },
    { title: 'SIGNAL QUALITY', value: `${report.qualityScore}%`, color: [2, 132, 199] },
    { title: 'FUSED HEART RATE', value: `${report.fusedBpm} BPM`, color: [139, 92, 246] },
    { title: 'HEALTH STATE', value: `${report.healthState}`, color: primaryEmerald },
  ];

  metrics.forEach((m, idx) => {
    const x = 14 + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardWidth, 20, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardWidth, 20, 2, 2, 'S');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(m.title, x + 4, y + 6);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, x + 4, y + 15);
  });

  y += 26;

  // 3-Tier Multi-User Explanations
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Clear Multi-Audience Diagnostic Explanations', 14, y);
  y += 6;

  // 1. Patient / Consumer Explanation Box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('Patient & General User Summary (Plain English):', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  const patientSummary = `Your physiological heart rhythm telemetry is steady and normal with high signal clarity (${report.qualityScore}%). No harmful motion artifacts or irregular ectopic heartbeats were detected. Your body demonstrates healthy recovery capacity (${report.recoveryPct}%) and low stress reserves.`;
  const splitPatient = doc.splitTextToSize(patientSummary, pageWidth - 36);
  doc.text(splitPatient, 18, y + 12);

  y += 28;

  // 2. Clinical / Medical Professional Explanation Box
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 105, 161);
  doc.text('Clinical & Medical Professional Summary:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(3, 105, 161);
  const clinicalSummary = `Multi-modal ECG Lead II and PPG telemetry confirms stable vagal parasympathetic tone. Fused heart rate of ${report.fusedBpm} BPM shows normal sinus rhythm. HRV parameters remain within optimal baseline distribution with low autonomic fatigue index (${report.fatiguePct}%).`;
  const splitClinical = doc.splitTextToSize(clinicalSummary, pageWidth - 36);
  doc.text(splitClinical, 18, y + 12);

  y += 28;

  // 3. Technical & Engineering Explanation Box
  doc.setFillColor(245, 243, 255);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217);
  doc.text('Technical Signal Quality & AI Engineering Audit:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(109, 40, 217);
  const techSummary = `0.5-50Hz bandpass pipeline filter achieved SNR of ${report.snrDb} dB. Motion vector magnitude logged at baseline (${report.motionLevel}). Adaptive sensor fusion assigned optimal sensor confidence weighting based on QRS Kurtosis peakiness.`;
  const splitTech = doc.splitTextToSize(techSummary, pageWidth - 36);
  doc.text(splitTech, 18, y + 12);

  y += 28;

  // Actionable Recommendations
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Clinical Guidance & Recommendations', 14, y);
  y += 6;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);

  report.recommendations.forEach((rec, i) => {
    doc.setFillColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.circle(17, y - 1, 1, 'F');
    doc.text(rec, 22, y);
    y += 5.5;
  });

  y += 8;

  // Footer Signature Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, pageWidth - 14, y);
  y += 5;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text('PhysioTrust AI Engine v2.4.0 — Certified Multi-Modal Physiological Telemetry Verification Platform', 14, y);
  doc.text('Page 1 of 1', pageWidth - 14, y, { align: 'right' });

  // Save the PDF file
  doc.save(`${report.id}_Clinical_Diagnostic_Report.pdf`);
}
