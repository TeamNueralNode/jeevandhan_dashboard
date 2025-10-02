import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

// Export data to CSV
export function exportToCSV(data: unknown[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export table data to PDF
export function exportTableToPDF(
  data: Record<string, string | number>[],
  columns: { header: string; dataKey: string }[],
  title: string,
  filename: string
) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Add table
  autoTable(doc, {
    startY: 35,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey])),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });
  
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Export credit score explanation to PDF
export function exportScoreExplanationToPDF(scoreData: {
  beneficiaryId: string;
  beneficiaryName: string;
  compositeScore: number;
  repaymentScore: number;
  incomeScore: number;
  riskBand: string;
  calculatedAt: number;
  factors: Array<{ factor: string; impact: number; description: string }>;
}) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('Credit Score Explainability Report', 14, 20);
  
  // Beneficiary Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Beneficiary: ${scoreData.beneficiaryName} (${scoreData.beneficiaryId})`, 14, 35);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
  
  // Score Summary Box
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.rect(14, 50, 182, 40);
  
  doc.setFontSize(14);
  doc.text('Score Summary', 20, 58);
  
  doc.setFontSize(11);
  doc.text(`Composite Score: ${scoreData.compositeScore}/100`, 20, 68);
  doc.text(`Repayment Score: ${scoreData.repaymentScore}/100 (60% weight)`, 20, 75);
  doc.text(`Income Score: ${scoreData.incomeScore}/100 (40% weight)`, 20, 82);
  doc.text(`Risk Band: ${scoreData.riskBand}`, 20, 89);
  
  // Factor Impact Analysis
  doc.setFontSize(14);
  doc.text('Factor Impact Analysis', 14, 105);
  
  const factorData = scoreData.factors.map(f => [
    f.factor,
    f.impact > 0 ? `+${f.impact}` : f.impact.toString(),
    f.description
  ]);
  
  autoTable(doc, {
    startY: 110,
    head: [['Factor', 'Impact', 'Description']],
    body: factorData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 115 },
    },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | NBCFDC Credit Scoring System | Confidential`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`credit_score_${scoreData.beneficiaryId}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Export analytics report to PDF
export function exportAnalyticsToPDF(analyticsData: {
  processingTimeReduction: number;
  sameDaySanctions: number;
  sameDaySanctionRate: number;
  totalApplications: number;
  autoApprovalRate: number;
  riskBandDistribution: Record<string, number>;
}) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('Analytics Dashboard Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  
  // Key Metrics
  doc.setFontSize(14);
  doc.text('Key Performance Indicators', 14, 45);
  
  const kpiData = [
    ['Processing Time Reduction', `${analyticsData.processingTimeReduction}%`],
    ['Same-Day Sanctions', `${analyticsData.sameDaySanctions} (${analyticsData.sameDaySanctionRate}%)`],
    ['Total Applications', analyticsData.totalApplications.toString()],
    ['Auto-Approval Rate', `${analyticsData.autoApprovalRate}%`],
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [['Metric', 'Value']],
    body: kpiData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] },
    theme: 'striped',
  });
  
  // Risk Band Distribution
  const lastTableY = (doc as  {lastAutoTable?: { finalY: number }}).lastAutoTable?.finalY || 100;
  doc.setFontSize(14);
  doc.text('Risk Band Distribution', 14, lastTableY + 15);
  
  const riskData = Object.entries(analyticsData.riskBandDistribution).map(([band, count]) => [
    band,
    count.toString(),
    `${Math.round((count / analyticsData.totalApplications) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: lastTableY + 20,
    head: [['Risk Band', 'Count', 'Percentage']],
    body: riskData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] },
    theme: 'grid',
  });
  
  doc.save(`analytics_report_${new Date().toISOString().split('T')[0]}.pdf`);
}
