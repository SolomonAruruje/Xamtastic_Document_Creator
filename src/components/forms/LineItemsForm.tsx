import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatting";
import type { LineItem, DocumentType } from "@/types";

interface LineItemsFormProps {
  lineItems: LineItem[];
  onLineItemsChange: (items: LineItem[]) => void;
  documentNumber: string;
  onDocumentNumberChange: (number: string) => void;
  dateIssued: string;
  onDateIssuedChange: (date: string) => void;
  dueDate: string;
  onDueDateChange: (date: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  vatRate: number;
  onVatRateChange: (rate: number) => void;
  documentType: DocumentType;
}

export const LineItemsForm = ({
  lineItems,
  onLineItemsChange,
  documentNumber,
  onDocumentNumberChange,
  dateIssued,
  onDateIssuedChange,
  dueDate,
  onDueDateChange,
  notes,
  onNotesChange,
  vatRate,
  onVatRateChange,
  documentType,
}: LineItemsFormProps) => {
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onLineItemsChange([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    onLineItemsChange(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        
        return updatedItem;
      }
      return item;
    });
    onLineItemsChange(updatedItems);
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
    <div className="space-y-6">
      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentNumber">{getDocumentLabel()} Number</Label>
          <Input
            id="documentNumber"
            placeholder="001"
            value={documentNumber}
            onChange={(e) => onDocumentNumberChange(e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateIssued">
            {documentType === 'receipt' ? 'Date' : 'Date Issued'}
          </Label>
          <Input
            id="dateIssued"
            type="date"
            value={dateIssued}
            onChange={(e) => onDateIssuedChange(e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        {documentType !== 'receipt' && (
          <div className="space-y-2">
            <Label htmlFor="dueDate">
              {documentType === 'quotation' ? 'Valid Until' : 'Due Date'}
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <Button
            onClick={addLineItem}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5 space-y-1">
                {index === 0 && <Label className="text-xs">Description</Label>}
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  className="border-border focus:ring-primary"
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                {index === 0 && <Label className="text-xs">Qty</Label>}
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="border-border focus:ring-primary"
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                {index === 0 && <Label className="text-xs">Rate</Label>}
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={item.rate}
                  onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="border-border focus:ring-primary"
                />
              </div>
              
               <div className="col-span-2 space-y-1">
                 {index === 0 && <Label className="text-xs">Amount</Label>}
                 <Input
                   value={`₦${formatCurrency(item.amount)}`}
                   readOnly
                   className="bg-muted border-border"
                 />
               </div>
              
              <div className="col-span-1">
                {lineItems.length > 1 && (
                  <Button
                    onClick={() => removeLineItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VAT Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vatRate">VAT Rate (%)</Label>
          <Input
            id="vatRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0"
            value={vatRate}
            onChange={(e) => onVatRateChange(parseFloat(e.target.value) || 0)}
            className="border-border focus:ring-primary"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes or terms..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="border-border focus:ring-primary resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};