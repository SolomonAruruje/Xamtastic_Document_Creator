import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { History, Download, Trash2, FileText, Edit } from "lucide-react";
import { getSavedDocuments, deleteDocument, type SavedDocument } from "@/lib/utils/storage";
import { generatePDF } from "@/lib/pdfGenerator";
import { formatCurrency } from "@/lib/utils/formatting";
import { useToast } from "@/hooks/use-toast";

interface SavedDocumentsProps {
  onEditDocument: (document: SavedDocument) => void;
}

export const SavedDocuments = ({ onEditDocument }: SavedDocumentsProps) => {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setDocuments(getSavedDocuments());
    }
  }, [isOpen]);

  const handleDownload = async (document: SavedDocument) => {
    try {
      await generatePDF(document.documentData);
      toast({
        title: "PDF Downloaded!",
        description: `${document.type} #${document.documentNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
    setDocuments(getSavedDocuments());
    toast({
      title: "Document Deleted",
      description: "The document has been removed from your saved documents.",
    });
  };

  const handleEdit = (document: SavedDocument) => {
    onEditDocument(document);
    setIsOpen(false);
    toast({
      title: "Document Loaded",
      description: `${document.type} #${document.documentNumber} has been loaded for editing.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Saved ({documents.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Saved Documents
          </DialogTitle>
        </DialogHeader>
        
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No saved documents yet. Generate and save your first document!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="capitalize">
                          {document.type}
                        </Badge>
                        <span className="font-medium">#{document.documentNumber}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(document.dateCreated)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{document.clientName}</p>
                          <p className="text-lg font-bold text-primary">
                            ₦{formatCurrency(document.total)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEdit(document)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDownload(document)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            onClick={() => handleDelete(document.id)}
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};