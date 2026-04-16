/**
 * MOCKS DOCUMENTS
 */

import { Document, ApiResponse } from '@contracts/api-contracts';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Proforma de service.df',
    type: 'PDF',
    size: 2547890,
    uploadedAt: '2024-04-01T10:00:00Z',
    uploadedBy: 'admin',
    url: '/mock/documents/proforma-service.pdf',
    description: 'Proforma de service Boaz Study',
    preview: 'proforma',
  },
  {
    id: 'doc-002',
    name: 'Mon_contrat.df',
    type: 'PDF',
    size: 1234567,
    uploadedAt: '2024-03-28T14:30:00Z',
    uploadedBy: 'admin',
    url: '/mock/documents/mon-contrat.pdf',
    description: 'Contrat signé',
    preview: 'contrat',
  },
];

/**
 * Service mock pour les documents
 */
export const documentsService = {
  /**
   * Récupérer tous les documents
   */
  getAllDocuments: async (): Promise<ApiResponse<Document[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    return {
      success: true,
      data: MOCK_DOCUMENTS,
      message: 'Documents récupérés avec succès',
    };
  },

  /**
   * Récupérer un document par ID
   */
  getDocumentById: async (id: string): Promise<ApiResponse<Document | null>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const document = MOCK_DOCUMENTS.find((d) => d.id === id);

    return {
      success: !!document,
      data: document || null,
      message: document ? 'Document trouvé' : 'Document non trouvé',
    };
  },

  /**
   * Uploader un document
   */
  uploadDocument: async (file: File, description?: string): Promise<ApiResponse<Document>> => {
    // Simulation d'un upload avec délai progressif
    await new Promise((resolve) => setTimeout(resolve, 50));

    const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'OTHER';
    let documentType: Document['type'] = 'OTHER';

    if (['PDF'].includes(fileExtension)) documentType = 'PDF';
    else if (['DOC', 'DOCX'].includes(fileExtension)) documentType = 'WORD';
    else if (['XLS', 'XLSX'].includes(fileExtension)) documentType = 'EXCEL';
    else if (['JPG', 'JPEG', 'PNG', 'GIF'].includes(fileExtension)) documentType = 'IMAGE';

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: documentType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current-user',
      url: `/mock/documents/${file.name}`,
      description,
    };

    MOCK_DOCUMENTS.unshift(newDocument);

    return {
      success: true,
      data: newDocument,
      message: 'Document uploadé avec succès',
    };
  },

  /**
   * Télécharger un document
   */
  downloadDocument: async (id: string): Promise<ApiResponse<string>> => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const document = MOCK_DOCUMENTS.find((d) => d.id === id);

    if (!document) {
      return {
        success: false,
        data: '',
        message: 'Document non trouvé',
      };
    }

    return {
      success: true,
      data: document.url,
      message: 'Téléchargement démarré',
    };
  },

  /**
   * Renommer / mettre à jour un document
   */
  updateDocument: async (
    id: string,
    updates: Partial<Pick<Document, 'name' | 'description'>>,
  ): Promise<ApiResponse<Document | null>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const doc = MOCK_DOCUMENTS.find((d) => d.id === id);
    if (!doc) {
      return {
        success: false,
        data: null,
        message: 'Document non trouvé',
      };
    }

    if (updates.name !== undefined) doc.name = updates.name;
    if (updates.description !== undefined) doc.description = updates.description;

    return {
      success: true,
      data: doc,
      message: 'Document mis à jour',
    };
  },

  /**
   * Supprimer un document
   */
  deleteDocument: async (id: string): Promise<ApiResponse<boolean>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const index = MOCK_DOCUMENTS.findIndex((d) => d.id === id);

    if (index === -1) {
      return {
        success: false,
        data: false,
        message: 'Document non trouvé',
      };
    }

    MOCK_DOCUMENTS.splice(index, 1);

    return {
      success: true,
      data: true,
      message: 'Document supprimé avec succès',
    };
  },
};
