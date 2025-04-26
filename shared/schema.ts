import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  processed: boolean("processed").default(false).notNull(),
  title: text("title"),
  agency: text("agency"),
  rfpNumber: text("rfp_number"),
  dueDate: text("due_date"),
  estimatedValue: text("estimated_value"),
  contractTerm: text("contract_term"),
  contactPerson: text("contact_person"),
  opportunityScore: integer("opportunity_score"),
  keyDates: json("key_dates").$type<KeyDate[]>(),
  requirements: json("requirements").$type<Requirements>(),
  aiAnalysis: json("ai_analysis").$type<AIAnalysis>(),
  fullText: text("full_text"),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  fileName: true,
  fileType: true,
  fileSize: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export interface KeyDate {
  event: string;
  date: string;
  icon: string;
  passed: boolean;
}

export interface Requirements {
  technical: string[];
  qualifications: string[];
}

export interface AIAnalysis {
  keyInsights: string[];
  strengths: string[];
  challenges: string[];
}
