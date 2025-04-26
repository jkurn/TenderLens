import OpenAI from "openai";
import { AIAnalysis, Requirements } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AnalysisResult {
  title: string;
  agency: string;
  rfpNumber: string;
  dueDate: string;
  estimatedValue: string;
  contractTerm: string;
  contactPerson: string;
  opportunityScore: number;
  keyDates: Array<{
    event: string;
    date: string;
    icon: string;
    passed: boolean;
  }>;
  requirements: {
    technical: string[];
    qualifications: string[];
  };
  aiAnalysis: {
    keyInsights: string[];
    strengths: string[];
    challenges: string[];
  };
}

export async function analyzeDocument(text: string): Promise<AnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an expert RFP analyst specialized in extracting and analyzing information from Request for Proposal documents. " +
            "Extract key information in a structured format, provide accurate opportunity scoring, and deliver insights about the RFP."
        },
        {
          role: "user",
          content: 
            `Analyze the following RFP document text and extract the following information in JSON format:
            
            1. Basic information: title, issuing agency, RFP number, due date, estimated value, contract term, contact person
            2. Key dates: List of important dates mentioned (event name, date, appropriate icon from: check, question, comment, or file)
            3. Requirements: Technical requirements and qualification requirements
            4. AI Analysis: Key insights (3), strengths (3), and challenges (3)
            5. Opportunity Score: A number between 1-100 based on the clarity of requirements, reasonable timeline, and overall quality
            
            Here's the document text:
            
            ${text.substring(0, 15000)} 
            
            Respond only with a JSON object containing the structured data.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.3,
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in the AI response");
    }

    const result = JSON.parse(response.choices[0].message.content) as AnalysisResult;
    
    // Ensure the opportunity score is between 1-100
    result.opportunityScore = Math.max(1, Math.min(100, result.opportunityScore));
    
    // Ensure we have at least empty arrays for all required fields
    if (!result.requirements) {
      result.requirements = { technical: [], qualifications: [] };
    }
    
    if (!result.aiAnalysis) {
      result.aiAnalysis = { keyInsights: [], strengths: [], challenges: [] };
    }
    
    return result;
  } catch (error) {
    console.error("Error analyzing document with OpenAI:", error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
}
