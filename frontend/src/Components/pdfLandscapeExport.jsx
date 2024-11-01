import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const pdfLandscapeExport = async (title, columns, data) => {
    const doc = new jsPDF('landscape');

    // Load the background image once and convert it to base64
    const imgUrl = '/pdf_bg_ls.png';
    const img = await fetch(imgUrl).then(res => res.blob());
    const reader = new FileReader();

    reader.readAsDataURL(img);
    reader.onloadend = () => {
        const base64Image = reader.result;

        // Set initial properties for the document
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(24);
        doc.setTextColor(44, 62, 80);
        doc.text(title, 120, 40); // Title
        doc.setFontSize(20);
        doc.text(`Date: ${currentDate}`, 240, 40); // Date text

        // Add DataTable content with didDrawPage hook to add background on each page
        doc.autoTable({
            startY: 50,
            head: [columns],
            body: data,
            theme: 'grid',
            styles: {
                fontSize: 10,
                textColor: [44, 62, 80],
                fillColor: [255, 255, 255],
                halign: 'center'
            },
            headStyles: {
                fillColor: [0, 194, 97],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
                halign: 'center'
            },
            margin: { top: 40, bottom: 30 },

            // Add background image to each page
            didDrawPage: (data) => {
                doc.addImage(base64Image, 'PNG', 0, 0, 297, 210);
            },
        });

        // Save the PDF
        doc.save(`${title}.pdf`);
    };
};

export default pdfLandscapeExport;
