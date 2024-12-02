import jsPDF from 'jspdf';

export const ProcessingReturnWSR = (initialData, processedData, viewMode, additionalFields = {}) => {
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
    const receiptNumber = `WSR-${initialData.wsr}`;
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

    // Prepare processed data sections based on view mode
    const processedSectionTitle = viewMode === 'drying' ? 'DRYING INFORMATION' : 'MILLING INFORMATION';
    const processedSectionFields = [
        { label: 'Batch ID', value: displayValue(processedData.batchId) },
        { label: 'Processing Facility', value: displayValue(processedData.facilityName) },
        { label: 'Processing Start Date', value: formatDate(processedData.startDateTime) },
        { label: 'Processing End Date', value: formatDate(processedData.endDateTime) },
        { label: viewMode === 'drying' ? 'Dried Quantity (Bags)' : 'Milled Quantity (Bags)', 
          value: displayValue(processedData.processedQuantityBags) },
        { label: 'Moisture Content', value: viewMode === 'drying' ? 
          `${displayValue(processedData.moistureContent)}%` : null },
        { label: 'Milling Efficiency', value: viewMode === 'milling' ? 
          `${displayValue(processedData.millingEfficiency)}%` : null },
        { label: 'Processed Net Weight', value: `${displayValue(processedData.processedNetWeight)} kg` },
    ].filter(field => field.value !== null);

    // Define default sections
    const sections = {
        farmer: [
            { label: 'Category', value: displayValue(initialData.category) },
            { label: 'Name', value: displayValue(initialData.farmerName) },
            { label: 'Contact', value: displayValue(initialData.contactNumber) },
            { label: 'Address', value: [
                displayValue(initialData.farmStreet),
                displayValue(initialData.farmBarangay),
                displayValue(initialData.farmCityTown),
                displayValue(initialData.farmProvince),
                displayValue(initialData.farmRegion)
            ].filter(Boolean).join(', ') }
        ],
        palay: [
            { label: 'Batch Id', value: displayValue(initialData.palayId) },
            { label: 'Date Bought', value: formatDate(initialData.dateBought) },
            { label: 'Variety', value: displayValue(initialData.palayVariety) },
            { label: 'Quality Type', value: displayValue(initialData.qualityType) },
            { label: 'Initial Quantity (Bags)', value: displayValue(initialData.quantityBags) },
            { label: 'Gross Weight', value: initialData.grossWeight ? `${displayValue(initialData.grossWeight)} kg` : null },
            { label: 'Net Weight', value: initialData.netWeight ? `${displayValue(initialData.netWeight)} kg` : null },
        ],
        logistics: [
            { label: 'Transaction ID', value: displayValue(initialData.transactionId) },
            { label: 'From', value: `${displayValue(initialData.fromLocationType)} (ID: ${displayValue(initialData.fromLocationId)})` },
            { label: 'To', value: `${displayValue(initialData.toLocationType)} (ID: ${displayValue(initialData.toLocationId)})` },
            { label: 'Send Date', value: formatDate(initialData.sendDateTime) },
        ]
    };

    // Add sections
    addSection('FARMER INFORMATION', sections.farmer);
    addSection('INITIAL PALAY INFORMATION', sections.palay);
    addSection('LOGISTICS INFORMATION', sections.logistics);
    addSection(processedSectionTitle, processedSectionFields);

    return pdf;
};