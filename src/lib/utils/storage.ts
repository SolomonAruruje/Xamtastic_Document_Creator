// Local storage utilities for saving/loading documents

export interface SavedDocument {
  id: string;
  type: 'invoice' | 'quotation' | 'receipt';
  documentNumber: string;
  clientName: string;
  total: number;
  dateCreated: string;
  documentData: any;
}

const STORAGE_KEY = 'saved_documents';

export const saveDocument = (documentData: any): string => {
  const documents = getSavedDocuments();
  const id = Date.now().toString();
  
  const newDocument: SavedDocument = {
    id,
    type: documentData.documentType,
    documentNumber: documentData.documentNumber || 'XXX',
    clientName: documentData.clientInfo.name || 'Unknown Client',
    total: documentData.total,
    dateCreated: new Date().toISOString(),
    documentData,
  };

  documents.push(newDocument);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  
  return id;
};

export const getSavedDocuments = (): SavedDocument[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getDocumentById = (id: string): SavedDocument | null => {
  const documents = getSavedDocuments();
  return documents.find(doc => doc.id === id) || null;
};

export const updateDocument = (id: string, documentData: any): void => {
  const documents = getSavedDocuments();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index !== -1) {
    const updatedDocument: SavedDocument = {
      ...documents[index],
      type: documentData.documentType,
      documentNumber: documentData.documentNumber || 'XXX',
      clientName: documentData.clientInfo.name || 'Unknown Client',
      total: documentData.total,
      documentData,
    };
    
    documents[index] = updatedDocument;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }
};

export const deleteDocument = (id: string): void => {
  const documents = getSavedDocuments().filter(doc => doc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
};