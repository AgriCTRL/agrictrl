import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const pdfExport = async (title, columns, data) => {
    const doc = new jsPDF('portrait');

    // Load the background image once and convert it to base64
    const imgUrl = '/pdf_bg_pt.png';
    const img = await fetch(imgUrl).then(res => res.blob());
    const reader = new FileReader();

    reader.readAsDataURL(img);
    reader.onloadend = () => {
        const base64Image = reader.result;

        // Add background image to cover the whole page
        doc.addImage(base64Image, 'PNG', 0, 0, 210, 297); // A4

        //current date
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(24);
        doc.setTextColor(44, 62, 80);
        doc.text(`Date: ${currentDate}`, 140, 40); // (text, x-coor, y-coor)


        // Add title
        doc.setFontSize(24);
        doc.setTextColor(44, 62, 80);
        doc.text(title, 60, 70); // (text, x-coor, y-coor)

        // Add DataTable content
        doc.autoTable({
            startY: 80, // Starting Y position of the table
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
        });

        // Save the PDF
        doc.save(`${title}.pdf`);
    };
};

export default pdfExport;
