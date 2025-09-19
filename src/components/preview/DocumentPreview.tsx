import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/formatting";
import type { DocumentType, BusinessInfo, ClientInfo, LineItem } from "@/types";

interface DocumentPreviewProps {
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

export const DocumentPreview = ({
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
}: DocumentPreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8 text-gray-900 min-h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{getDocumentTitle()}</h1>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">{getDocumentLabel()} #:</span> {documentNumber || 'XXX'}</p>
            <p><span className="font-medium">
              {documentType === 'receipt' ? 'Date:' : 'Date Issued:'}
            </span> {formatDate(dateIssued) || 'Not set'}</p>
            {documentType !== 'receipt' && dueDate && (
              <p><span className="font-medium">
                {documentType === 'quotation' ? 'Valid Until:' : 'Due Date:'}
              </span> {formatDate(dueDate)}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          {businessInfo.logo && (
            <div className="flex justify-end mb-1">
              <img
                src={businessInfo.logo} 
                alt="Company Logo" 
                className="h-20 w-40 object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-lg mb-2">{businessInfo.name || 'Your Business'}</div>
            <div className="text-sm space-y-1 text-gray-600">
              {businessInfo.address && <p>{businessInfo.address}</p>}
              {(businessInfo.city || businessInfo.postalCode) && (
                <p>{businessInfo.city} {businessInfo.postalCode}</p>
              )}
              {businessInfo.phone && <p>{businessInfo.phone}</p>}
              {businessInfo.email && <p>{businessInfo.email}</p>}
              {businessInfo.website && <p>{businessInfo.website}</p>}
              {businessInfo.taxId && <p>Tax ID: {businessInfo.taxId}</p>}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">
          {documentType === 'receipt' ? 'Received From:' : 'Bill To:'}
        </h3>
        <div className="text-sm space-y-1">
          <p className="font-medium">{clientInfo.name || 'Client Name'}</p>
          {clientInfo.address && <p>{clientInfo.address}</p>}
          {(clientInfo.city || clientInfo.postalCode) && (
            <p>{clientInfo.city} {clientInfo.postalCode}</p>
          )}
          {clientInfo.email && <p>{clientInfo.email}</p>}
          {clientInfo.phone && <p>{clientInfo.phone}</p>}
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <div className="bg-gray-50 border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 font-semibold text-sm">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          
          {lineItems.map((item, index) => (
            <div key={item.id} className={`grid grid-cols-12 gap-4 p-4 text-sm ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}>
            <div className="col-span-6">{item.description || 'Item description'}</div>
            <div className="col-span-2 text-center">{item.quantity}</div>
            <div className="col-span-2 text-center">₦{formatCurrency(item.rate)}</div>
            <div className="col-span-2 text-right font-medium">₦{formatCurrency(item.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₦{formatCurrency(subtotal)}</span>
          </div>
          {vatRate > 0 && (
            <div className="flex justify-between">
              <span>VAT ({vatRate}%):</span>
              <span>₦{formatCurrency(vatAmount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₦{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-2">Notes:</h4>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
      
      {!notes && (
        <div className="border-t pt-6">
          <p className="text-xs text-gray-400 italic">
            Add notes in the Items tab to include additional terms or information.
          </p>
        </div>
      )}
    </div>
  );
};