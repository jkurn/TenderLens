import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { storage } from '../storage';
import { analyzeDocument } from './openai';
import { Document, InsertDocument } from '@shared/schema';
import pdfParse from 'pdf-parse';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    console.log('Extracting text from PDF using pdf-parse');
    // Use pdf-parse to extract text from PDF buffer
    const pdfData = await pdfParse(buffer);
    
    if (!pdfData || !pdfData.text) {
      throw new Error('No text content could be extracted from the PDF');
    }
    
    console.log(`Extracted ${pdfData.text.length} characters from PDF`);
    console.log(`PDF has ${pdfData.numpages} pages`);
    
    return pdfData.text;
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    const errorMessage = error?.message || 'Unknown error';
    throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    // Save buffer to temp file because mammoth expects a file path
    const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}.docx`);
    await writeFile(tempFilePath, buffer);
    
    const result = await mammoth.extractRawText({ path: tempFilePath });
    
    // Clean up the temp file
    await unlink(tempFilePath);
    
    return result.value;
  } catch (error: any) {
    console.error('Error extracting text from DOCX:', error);
    const errorMessage = error?.message || 'Unknown error';
    throw new Error(`Failed to extract text from DOCX: ${errorMessage}`);
  }
}

export async function processDocument(file: UploadedFile): Promise<Document> {
  try {
    // 1. Create initial document record
    const insertDoc: InsertDocument = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size
    };
    
    const document = await storage.createDocument(insertDoc);
    
    // 2. Extract text based on file type
    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await extractTextFromPdf(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractTextFromDocx(file.buffer);
    } else {
      throw new Error('Unsupported file format');
    }
    
    if (!text || text.trim() === '') {
      throw new Error('No text content could be extracted from the document');
    }
    
    // 3. Analyze the document using OpenAI
    const analysis = await analyzeDocument(text);
    
    // 4. Update document with analysis results
    const updatedDocument = await storage.updateDocument(document.id, {
      processed: true,
      fullText: text,
      title: analysis.title,
      agency: analysis.agency,
      rfpNumber: analysis.rfpNumber,
      dueDate: analysis.dueDate,
      estimatedValue: analysis.estimatedValue,
      contractTerm: analysis.contractTerm,
      contactPerson: analysis.contactPerson,
      opportunityScore: analysis.opportunityScore,
      keyDates: analysis.keyDates,
      requirements: analysis.requirements,
      aiAnalysis: analysis.aiAnalysis
    });
    
    if (!updatedDocument) {
      throw new Error(`Failed to update document with ID ${document.id}`);
    }
    
    return updatedDocument;
  } catch (error: any) {
    console.error('Error processing document:', error);
    const errorMessage = error?.message || 'Unknown error';
    throw new Error(`Document processing failed: ${errorMessage}`);
  }
}
