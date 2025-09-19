import { Button } from "@/components/ui/button";
import { FileText, Calculator, Receipt } from "lucide-react";
import type { DocumentType } from "@/types";

interface DocumentTypeSelectorProps {
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
}

export const DocumentTypeSelector = ({
  documentType,
  onDocumentTypeChange,
}: DocumentTypeSelectorProps) => {
  const documentTypes = [
    { value: "invoice" as DocumentType, label: "Invoice", icon: FileText },
    { value: "quotation" as DocumentType, label: "Quotation", icon: Calculator },
    { value: "receipt" as DocumentType, label: "Receipt", icon: Receipt },
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1">
      {documentTypes.map((type) => {
        const Icon = type.icon;
        return (
          <Button
            key={type.value}
            variant={documentType === type.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onDocumentTypeChange(type.value)}
            className={`flex items-center gap-2 ${
              documentType === type.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-background/80"
            }`}
          >
            <Icon className="h-4 w-4" />
            {type.label}
          </Button>
        );
      })}
    </div>
  );
};