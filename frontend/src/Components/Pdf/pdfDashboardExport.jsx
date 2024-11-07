import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const pdfDashboardExport = async (data, chartInterpretations) => {
    const chartImages = await captureCharts();
    const imgUrl = '/pdf_bg_pt.png';
    const img = await fetch(imgUrl).then(res => res.blob());
    const reader = new FileReader();

    const doc = new jsPDF('portrait');
    let yPosition = 50;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const chartWidth = pageWidth - (margin * 2);
    const chartHeight = 100;

    reader.readAsDataURL(img);
    reader.onloadend = () => {
        const base64Image = reader.result;

        const addBackgroundImage = () => {
            doc.addImage(base64Image, 'PNG', 0, 0, pageWidth, pageHeight);
        };

        addBackgroundImage();

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(24);
        doc.setTextColor(44, 62, 80);
        doc.text('Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Generated: ${currentDate}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 30;

        const statsColumns = ['Metric', 'Count'];
        const statsData = [
            ['Partner Farmers', data.partnerFarmersCount],
            ['Total Palays', data.totalPalaysCount],
            ['Total Rice', data.totalRiceCount],
            ['Rice Sold', data.riceSoldCount]
        ];

        doc.setFontSize(18);
        doc.text('Key Statistics', margin, yPosition);
        yPosition += 10;

        doc.autoTable({
            startY: yPosition,
            head: [statsColumns],
            body: statsData,
            theme: 'grid',
            headStyles: { fillColor: [0, 194, 97], textColor: [255, 255, 255] },
            margin: { left: margin }
        });
        yPosition = doc.lastAutoTable.finalY + 20;

        doc.addPage();
        addBackgroundImage();
        yPosition = margin + 30;

        for (const [chartId, chartImage] of Object.entries(chartImages)) {
            if (yPosition + chartHeight + 30 > pageHeight) {
                doc.addPage();
                addBackgroundImage();
                yPosition = margin + 30;
            }

            doc.setFontSize(24);
            doc.text(getChartTitle(chartId), margin, yPosition);
            yPosition += 10;

            doc.addImage(chartImage, 'PNG', margin, yPosition, chartWidth, chartHeight);
            yPosition += chartHeight + 10;

            // Add the interpretation if available
            const chartInterpretation = chartInterpretations[chartId] || '';
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(chartInterpretation, margin, yPosition, { maxWidth: chartWidth });
            yPosition += 20;
        }

        doc.save('Dashboard-Report.pdf');
    };
};

// Helper function to capture all charts as images
const captureCharts = async () => {
    const chartIds = [
        'supplier-demographic-chart',
        'processing-status-chart',
        'inventory-analytics-chart',
        'wet-dry-inventory-chart',
        'milling-status-chart',
        'monthly-batch-count-chart',
        'nfa-facilities-chart',
        'rice-inventory-level',
        'miller-efficiency-comparison',
        'warehouse-inventory-trend',
        'rice-orders-analytics',
    ];

    const chartImages = {};
    
    for (const chartId of chartIds) {
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            try {
                // If it's a Chart.js canvas
                if (chartElement.tagName.toLowerCase() === 'canvas') {
                    chartImages[chartId] = chartElement.toDataURL('image/png');
                }
                // If it's a container with a canvas (for PrimeReact Charts)
                else {
                    const canvas = chartElement.querySelector('canvas');
                    if (canvas) {
                        chartImages[chartId] = canvas.toDataURL('image/png');
                    }
                }
            } catch (error) {
                console.error(`Error capturing chart ${chartId}:`, error);
            }
        }
    }

    return chartImages;
};

// Helper function to get chart titles
const getChartTitle = (chartId) => {
    const titles = {
        'supplier-demographic-chart': 'Supplier Categories Distribution',
        'processing-status-chart': 'Processing Status',
        'inventory-analytics-chart': 'Inventory Analytics',
        'wet-dry-inventory-chart': 'Wet/Dry Inventory',
        'milling-status-chart': 'Milling Status',
        'monthly-batch-count-chart': 'Monthly Batch Count',
        'nfa-facilities-chart': 'NFA Facilities Distribution',
        'rice-inventory-level': 'Rice Inventory Level',
        'miller-efficiency-comparison': 'Miller Efficiency Comparison',
        'warehouse-inventory-trend': 'Warehouse Inventory Trend',
        'rice-orders-analytics': 'Rice Orders Analytics',
    };
    return titles[chartId] || 'Chart';
};

export default pdfDashboardExport;
