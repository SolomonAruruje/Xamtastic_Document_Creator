import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils/formatting';
import type { DocumentType, BusinessInfo, ClientInfo, LineItem } from '@/types';

interface PDFData {
  documentType: DocumentType;
  businessInfo: BusinessInfo;
  clientInfo: ClientInfo;
  lineItems: LineItem[];
  documentNumber: string;
  dateIssued: string;
  dueDate: string;
  notes: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export const generatePDF = async (data: PDFData) => {
  const {
    documentType,
    businessInfo,
    clientInfo,
    lineItems,
    documentNumber,
    dateIssued,
    dueDate,
    notes,
    subtotal,
    vatRate,
    vatAmount,
    total,
  } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Colors
  const primaryColor = '#2563eb'; // Blue
  const textColor = '#374151'; // Gray-700
  const lightGrayColor = '#f3f4f6'; // Gray-100

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'invoice': return 'INVOICE';
      case 'quotation': return 'QUOTATION';
      case 'receipt': return 'RECEIPT';
      default: return 'DOCUMENT';
    }
  };

  const getDocumentLabel = () => {
    switch (documentType) {
      case 'invoice': return 'Invoice';
      case 'quotation': return 'Quote';
      case 'receipt': return 'Receipt';
      default: return 'Document';
    }
  };

  // Header - Document title on left
  let yPosition = 20;
  
  doc.setFontSize(28);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(getDocumentTitle(), 20, yPosition);

  // Business section on right side
  let businessYPosition = 20;
  
  // Add logo if available (positioned above business name, right aligned)
  if (businessInfo.logo) {
    try {
      const logoWidth = 35;
      const logoHeight = 35;
      doc.addImage(businessInfo.logo, 'JPEG', pageWidth - 20 - logoWidth, businessYPosition - 5, logoWidth, logoHeight);
      businessYPosition += logoHeight + 5; // Space after logo
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }
  
  // Business info (right aligned, positioned below logo)
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  const businessName = businessInfo.name || 'Your Business';
  doc.text(businessName, pageWidth - 20, businessYPosition, { align: 'right' });

  businessYPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  if (businessInfo.address) {
    doc.text(businessInfo.address, pageWidth - 20, businessYPosition, { align: 'right' });
    businessYPosition += 5;
  }
  if (businessInfo.city || businessInfo.postalCode) {
    doc.text(`${businessInfo.city} ${businessInfo.postalCode}`, pageWidth - 20, businessYPosition, { align: 'right' });
    businessYPosition += 5;
  }
  if (businessInfo.phone) {
    doc.text(businessInfo.phone, pageWidth - 20, businessYPosition, { align: 'right' });
    businessYPosition += 5;
  }
  if (businessInfo.email) {
    doc.text(businessInfo.email, pageWidth - 20, businessYPosition, { align: 'right' });
    businessYPosition += 5;
  }

  // Document details (left side)
  yPosition = Math.max(businessYPosition + 10, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`${getDocumentLabel()} #: ${documentNumber || 'XXX'}`, 20, yPosition);
  yPosition += 5;
  
  const dateLabel = documentType === 'receipt' ? 'Date:' : 'Date Issued:';
  doc.text(`${dateLabel} ${formatDate(dateIssued)}`, 20, yPosition);
  yPosition += 5;
  
  if (documentType !== 'receipt' && dueDate) {
    const dueDateLabel = documentType === 'quotation' ? 'Valid Until:' : 'Due Date:';
    doc.text(`${dueDateLabel} ${formatDate(dueDate)}`, 20, yPosition);
    yPosition += 5;
  }

  yPosition += 10;

  // Bill To
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const billToLabel = documentType === 'receipt' ? 'Received From:' : 'Bill To:';
  doc.text(billToLabel, 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text(clientInfo.name || 'Client Name', 20, yPosition);
  yPosition += 5;
  
  if (clientInfo.address) {
    doc.text(clientInfo.address, 20, yPosition);
    yPosition += 5;
  }
  if (clientInfo.city || clientInfo.postalCode) {
    doc.text(`${clientInfo.city} ${clientInfo.postalCode}`, 20, yPosition);
    yPosition += 5;
  }
  if (clientInfo.email) {
    doc.text(clientInfo.email, 20, yPosition);
    yPosition += 5;
  }

  yPosition += 15;

  // Line Items Table
  const tableData = lineItems.map(item => [
    item.description || 'Item description',
    item.quantity.toString(),
    `₦${formatCurrency(item.rate)}`,
    `₦${formatCurrency(item.amount)}`
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: tableData,
    styles: {
      fontSize: 10,
      textColor: textColor,
      lineColor: '#d1d5db',
      lineWidth: 0.5,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: '#f3f4f6',
      textColor: textColor,
      fontStyle: 'bold',
      lineColor: '#d1d5db',
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: '#f9fafb',
    },
    columnStyles: {
      0: { 
        cellWidth: 'auto',
        overflow: 'linebreak',
        halign: 'left',
      },
      1: { 
        halign: 'center',
        cellWidth: 25,
      },
      2: { 
        halign: 'center',
        cellWidth: 30,
      },
      3: { 
        halign: 'right',
        cellWidth: 35,
      },
    },
    margin: { left: 20, right: 20 },
    tableLineColor: '#d1d5db',
    tableLineWidth: 0.5,
    showHead: 'everyPage',
    theme: 'grid',
  });

  // Get the Y position after the table
  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Totals
  const totalsX = pageWidth - 80;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', totalsX, yPosition);
  doc.text(`₦${formatCurrency(subtotal)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 5;

  if (vatRate > 0) {
    doc.text(`VAT (${vatRate}%):`, totalsX, yPosition);
    doc.text(`₦${formatCurrency(vatAmount)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 5;
  }

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX, yPosition + 2, pageWidth - 20, yPosition + 2);
  yPosition += 8;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', totalsX, yPosition);
  doc.text(`₦${formatCurrency(total)}`, pageWidth - 20, yPosition, { align: 'right' });

  // Notes
  if (notes) {
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    
    const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPosition);
  }

  // Save the PDF
  const fileName = `${documentType}_${documentNumber || 'XXX'}.pdf`;
  doc.save(fileName);
};