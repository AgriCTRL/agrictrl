import jsPDF from 'jspdf';

export const WSR = (data, additionalFields = {}) => {
    // Initialize PDF (4x6 inches, portrait)
    const pdf = new jsPDF({
        unit: 'in',
        format: [4, 6]
    });

    // Add background image
    const imgUrl = '/pdf_bg_wsr.png';
    pdf.addImage(imgUrl, 'PNG', 0, 0, 4, 6);

    // Set default font styles
    pdf.setFont('helvetica');
    const headerSize = 8;
    const contentSize = 7;
    
    // Helper functions
    const displayValue = (value) => value || 'N/A';
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Add receipt number and date at the top
    pdf.setFontSize(headerSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    const receiptNumber = `WSR-${data.wsr}`;
    pdf.text(receiptNumber, 1.2, 0.4);
    
    const currentDate = new Date().toLocaleDateString();
    pdf.text(currentDate, 3.4, 0.2);
    pdf.setTextColor(0, 0, 0);

    // Current position tracker
    let yPos = 0.5;
    const lineHeight = 0.15;
    const sectionGap = 0.2;
    const indent = 0.2;

    // Helper function to add a section
    const addSection = (title, fields) => {
        pdf.setFontSize(headerSize);
        pdf.setFont('helvetica', 'bold');
        yPos += sectionGap;
        pdf.text(title, indent, yPos);
        yPos += lineHeight;

        pdf.setFontSize(contentSize);
        pdf.setFont('helvetica', 'normal');
        
        fields.forEach(field => {
            if (field.value) {
                const label = field.label ? `${field.label}: ` : '';
                const text = `${label}${field.value}`;
                pdf.text(text, indent + 0.1, yPos);
                yPos += lineHeight;
            }
        });
    };

    // Define default sections with their fields
    const defaultSections = {
        farmer: [
            { label: 'Category', value: displayValue(data.category) },
            { label: 'Name', value: displayValue(data.farmerName) },
            { label: 'Number of Farmers', value: data.category === 'cooperative' ? displayValue(data.numOfFarmer) : null },
            { label: 'Gender', value: data.category === 'individual' ? displayValue(data.gender) : null },
            { label: 'Email', value: displayValue(data.email) },
            { label: 'Contact', value: displayValue(data.contactNumber) },
            { label: 'Address', value: [
                displayValue(data.farmStreet),
                displayValue(data.farmBarangay),
                displayValue(data.farmCityTown),
                displayValue(data.farmProvince),
                displayValue(data.farmRegion)
            ].filter(Boolean).join(', ') }
        ],
        palay: [
            { label: 'Batch Id', value: displayValue(data.palayId) },
            { label: 'Date Bought', value: formatDate(data.dateBought) },
            { label: 'Variety', value: displayValue(data.palayVariety) },
            { label: 'Quality Type', value: displayValue(data.qualityType) },
            { label: 'Quantity (Bags)', value: displayValue(data.quantityBags) },
            { label: 'Gross Weight', value: data.grossWeight ? `${displayValue(data.grossWeight)} kg` : null },
            { label: 'Net Weight', value: data.netWeight ? `${displayValue(data.netWeight)} kg` : null },
            { label: 'Moisture Content', value: data.moistureContent ? `${displayValue(data.moistureContent)}%` : null },
            { label: 'Purity', value: data.purity ? `${displayValue(data.purity)}%` : null },
            { label: 'Damaged', value: data.damaged ? `${displayValue(data.damaged)}%` : null },
            { label: 'Price per kg', value: data.price ? `${displayValue(data.price)}` : null },
            { label: 'Planted Date', value: formatDate(data.plantedDate) },
            { label: 'Harvested Date', value: formatDate(data.harvestedDate) },
            { label: 'Estimated Capital', value: data.estimatedCapital ? `${displayValue(data.estimatedCapital)}` : null }
        ],
        logistics: [
            { label: 'Transaction ID', value: displayValue(data.transactionId) },
            { label: 'Buying Station', value: displayValue(data.buyingStationName) },
            { label: 'Station Location', value: displayValue(data.buyingStationLoc) },
            { label: 'From', value: `${displayValue(data.fromLocationType)} (ID: ${displayValue(data.fromLocationId)})` },
            { label: 'To', value: `${displayValue(data.toLocationType)} (ID: ${displayValue(data.toLocationId)})` },
            { label: 'Send Date', value: formatDate(data.sendDateTime || new Date()) },
            { label: 'Sender ID', value: displayValue(data.senderId) }
        ]
    };

    // Merge default fields with additional fields for each section
    const sections = {
        farmer: [...defaultSections.farmer, ...(additionalFields.farmer || [])],
        palay: [...defaultSections.palay, ...(additionalFields.palay || [])],
        logistics: [...defaultSections.logistics, ...(additionalFields.logistics || [])]
    };

    // Add sections
    addSection('FARMER INFORMATION', sections.farmer.filter(field => field && field.value));
    addSection('PALAY INFORMATION', sections.palay.filter(field => field && field.value));
    addSection('LOGISTICS INFORMATION', sections.logistics.filter(field => field && field.value));
    return pdf;
};

// for extra fields:
// const additionalFields = {
//     farmer: [
//         { label: 'New Field', value: 'New Value' }
//     ],
//     palay: [
//         { label: 'Custom Info', value: 'Some Info' }
//     ]
// };
// const pdf = generatePalayReceipt(data, additionalFields);
// pdf.save(`WSI-${data.itemId}.pdf`);