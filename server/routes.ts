import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import { insertDocumentSchema } from "@shared/schema";
import { processDocument } from "./services/documentProcessor";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF and DOCX files
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get document by ID
  app.get('/api/documents/:id', async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      
      if (isNaN(documentId)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      res.json(document);
    } catch (error) {
      console.error('Error retrieving document:', error);
      res.status(500).json({ message: 'Failed to retrieve document' });
    }
  });
  
  // List all documents
  app.get('/api/documents', async (req: Request, res: Response) => {
    try {
      const documents = await storage.listDocuments();
      res.json(documents);
    } catch (error) {
      console.error('Error listing documents:', error);
      res.status(500).json({ message: 'Failed to list documents' });
    }
  });
  
  // Upload and process document
  app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Start processing the document
      const document = await processDocument(req.file);
      
      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ 
        message: 'Failed to upload and process document',
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
