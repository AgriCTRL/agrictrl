import jsPDF from "jspdf";

export const WSI = (data) => {
  // Initialize PDF (4x6 inches, portrait)
  const pdf = new jsPDF({
    unit: "in",
    format: [4, 6],
  });

  // Add background image
  const imgUrl = "/pdf_bg_wsi.png";
  pdf.addImage(imgUrl, "PNG", 0, 0, 4, 6);

  // Set default font styles
  pdf.setFont("helvetica");
  const headerSize = 8;
  const contentSize = 7;

  // Helper functions
  const displayValue = (value) => value || "N/A";
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Add receipt number and date at the top
  pdf.setFontSize(headerSize);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  const receiptNumber = `WSI-${data.wsi}`;
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
    pdf.setFont("helvetica", "bold");
    yPos += sectionGap;
    pdf.text(title, indent, yPos);
    yPos += lineHeight;

    pdf.setFontSize(contentSize);
    pdf.setFont("helvetica", "normal");

    fields.forEach((field) => {
      if (field.value) {
        const label = field.label ? `${field.label}: ` : "";
        const text = `${label}${field.value}`;
        pdf.text(text, indent + 0.1, yPos);
        yPos += lineHeight;
      }
    });
  };

  // Palay Batch Information
  addSection("PALAY BATCH INFORMATION", [
    { label: "Palay Batch ID", value: displayValue(data.palayBatchId) },
    { label: "Palay Batch Status", value: displayValue(data.palayBatchStatus) },
    { label: "Current Location", value: displayValue(data.currentLocation) },
  ]);

  // Transactions
  addSection("TRANSACTIONS", [
    { label: "Transaction ID", value: displayValue(data.transactionId) },
    { label: "Sender ID", value: displayValue(data.senderId) },
    { label: "From Location Type", value: displayValue(data.fromLocationType) },
    { label: "From Location ID", value: displayValue(data.fromLocationId) },
    { label: "Send Date", value: formatDate(data.sendDate) },
    { label: "To Location Type", value: displayValue(data.toLocationType) },
    { label: "To Location ID", value: displayValue(data.toLocationId) },
  ]);

  // Warehouse Information
  addSection("WAREHOUSE INFORMATION", [
    { label: "Warehouse Name", value: displayValue(data.warehouseName) },
    {
      label: "Current Stock",
      value: data.currentStock
        ? `${displayValue(data.currentStock)} bags`
        : 0,
    },
  ]);

  return pdf;
};
