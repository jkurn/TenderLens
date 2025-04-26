import { 
  users, type User, type InsertUser,
  documents, type Document, type InsertDocument 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document methods
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined>;
  listDocuments(): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private userCurrentId: number;
  private documentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.userCurrentId = 1;
    this.documentCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Document methods
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentCurrentId++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument,
      id,
      uploadedAt: now,
      processed: false
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) {
      return undefined;
    }
    
    const updatedDocument = { ...document, ...updates };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async listDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
}

export const storage = new MemStorage();
