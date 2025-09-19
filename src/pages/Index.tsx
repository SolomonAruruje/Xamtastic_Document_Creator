import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessForm } from "@/components/forms/BusinessForm";
import { ClientForm } from "@/components/forms/ClientForm";
import { LineItemsForm } from "@/components/forms/LineItemsForm";
import { DocumentPreview } from "@/components/preview/DocumentPreview";
import { DocumentTypeSelector } from "@/components/DocumentTypeSelector";
import { SavedDocuments } from "@/components/SavedDocuments";
import { generatePDF } from "@/lib/pdfGenerator";
import { saveDocument, updateDocument, type SavedDocument } from "@/lib/utils/storage";
import { FileText, Download, Receipt, Calculator, Save, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import iconjpeg from '../../public/icon.jpeg';
import type { DocumentType, BusinessInfo, ClientInfo, LineItem } from "@/types";

const Index = () => {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("invoice");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    logo: "",
  });
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 }
  ]);
  const [documentNumber, setDocumentNumber] = useState("001");
  const [dateIssued, setDateIssued] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [vatRate, setVatRate] = useState(0);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const resetToFreshInvoice = () => {
    // Reset all form fields except business info
    setClientInfo({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      email: "",
      phone: "",
    });
    setLineItems([
      { id: "1", description: "", quantity: 1, rate: 0, amount: 0 }
    ]);
    setDateIssued(new Date().toISOString().split('T')[0]);
    setDueDate("");
    setNotes("");
    setVatRate(0);
    setEditingDocumentId(null);
    
    // Increment document number
    const currentNum = parseInt(documentNumber) || 0;
    setDocumentNumber(String(currentNum + 1).padStart(3, '0'));
  };

  const handleDownloadPDF = async () => {
    try {
      const documentData = {
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
      };
      
      // Save or update document first
      if (editingDocumentId) {
        updateDocument(editingDocumentId, documentData);
      } else {
        saveDocument(documentData);
      }
      
      // Then generate PDF
      await generatePDF(documentData);
      
      toast({
        title: "PDF Generated & Saved!",
        description: `Your ${documentType} has been downloaded and saved. Starting fresh ${documentType}.`,
      });
      
      // Reset to fresh invoice with incremented number
      resetToFreshInvoice();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    
    try {
      const documentData = {
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
      };
      
      // Save or update document first
      if (editingDocumentId) {
        updateDocument(editingDocumentId, documentData);
      } else {
        saveDocument(documentData);
      }
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `${documentType}_${documentNumber || 'XXX'}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Image Downloaded & Saved!",
        description: `Your ${documentType} has been downloaded as an image and saved. Starting fresh ${documentType}.`,
      });
      
      // Reset to fresh invoice with incremented number
      resetToFreshInvoice();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveDocument = () => {
    try {
      const documentData = {
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
      };
      
      if (editingDocumentId) {
        updateDocument(editingDocumentId, documentData);
      } else {
        saveDocument(documentData);
      }
      
      toast({
        title: "Document Saved!",
        description: `Your ${documentType} has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditDocument = (document: SavedDocument) => {
    const data = document.documentData;
    
    // Load all the form data from the saved document
    setDocumentType(data.documentType);
    setBusinessInfo(data.businessInfo);
    setClientInfo(data.clientInfo);
    setLineItems(data.lineItems);
    setDocumentNumber(data.documentNumber);
    setDateIssued(data.dateIssued);
    setDueDate(data.dueDate);
    setNotes(data.notes);
    setVatRate(data.vatRate);
    setEditingDocumentId(document.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container md:mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white border border-orange-500 rounded-sm flex items-center justify-center">
                <img src={iconjpeg} className="h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Xamtastic Electric</h1>
                <p className="text-sm text-muted-foreground">Quote/Invoice/Receipt Generator</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <SavedDocuments onEditDocument={handleEditDocument} />
              <DocumentTypeSelector
                documentType={documentType} 
                onDocumentTypeChange={setDocumentType} 
              />
              <Button 
                onClick={handleSaveDocument}
                variant="outline"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                onClick={handleDownloadImage}
                variant="outline"
                size="lg"
              >
                <Image className="h-4 w-4 mr-2" />
                Download Image
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                className="bg-primary hover:bg-primary/90 shadow-lg"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Forms Section */}
          <div className="space-y-6">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="items" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Items
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="business" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BusinessForm 
                      businessInfo={businessInfo} 
                      onBusinessInfoChange={setBusinessInfo} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="client" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClientForm 
                      clientInfo={clientInfo} 
                      onClientInfoChange={setClientInfo} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="items" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Line Items & Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LineItemsForm
                      lineItems={lineItems}
                      onLineItemsChange={setLineItems}
                      documentNumber={documentNumber}
                      onDocumentNumberChange={setDocumentNumber}
                      dateIssued={dateIssued}
                      onDateIssuedChange={setDateIssued}
                      dueDate={dueDate}
                      onDueDateChange={setDueDate}
                      notes={notes}
                      onNotesChange={setNotes}
                      vatRate={vatRate}
                      onVatRateChange={setVatRate}
                      documentType={documentType}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={previewRef}>
                  <DocumentPreview
                    documentType={documentType}
                    businessInfo={businessInfo}
                    clientInfo={clientInfo}
                    lineItems={lineItems}
                    documentNumber={documentNumber}
                    dateIssued={dateIssued}
                    dueDate={dueDate}
                    notes={notes}
                    subtotal={subtotal}
                    vatRate={vatRate}
                    vatAmount={vatAmount}
                    total={total}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;