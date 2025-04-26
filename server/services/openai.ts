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
            "You are an expert RFP analyst for public-sector suppliers and consultancies. You specialize in extracting and analyzing information from Request for Proposal documents, particularly government contracts. " +
            "You must extract all possible information from the document, even if it's partially obscured or requires inference. " +
            "Look for technical requirements, qualification criteria, and specific technologies mentioned. " +
            "Assign a high opportunity score (70+) when there are clear requirements, specific technologies mentioned (especially Microsoft technologies, cloud platforms, or AI services), and government/public sector issuers."
        },
        {
          role: "user",
          content: 
            `Analyze the following RFP document text and extract detailed information in JSON format. Be thorough and try to extract information even from partial text. Pay special attention to technical requirements and qualifications.
            
            1. Basic information:
               - title: Extract or infer the project title
               - agency: The issuing government agency or organization
               - rfpNumber: The RFP/tender identification number
               - dueDate: Submission deadline date
               - estimatedValue: Contract value if mentioned
               - contractTerm: Duration of the contract
               - contactPerson: Name, email, and phone of contact persons
            
            2. Key dates: Extract all project timeline dates (submission deadlines, Q&A periods, etc.) with:
               - event: Name of the milestone
               - date: The date in text format
               - icon: Use "check" for past dates, "file" for submissions, "question" for Q&A periods
               - passed: Boolean indicating if the date has passed
            
            3. Requirements: Separate into two arrays:
               - technical: Technical specifications, deliverables, technology requirements
               - qualifications: Vendor qualifications, certifications, experience requirements
            
            4. AI Analysis:
               - keyInsights: 3-5 important observations about the project
               - strengths: 3 potential advantages for an experienced vendor
               - challenges: 3 potential challenges or risks
            
            5. Opportunity Score: A number between 1-100:
               - 70-100 (Excellent/Good): Clear requirements, reasonable timeline, specific technologies
               - 40-69 (Fair): Average clarity, standard requirements, competitive field
               - 1-39 (Poor): Unclear scope, unrealistic timeline, excessive requirements
               
            Use domain knowledge to infer answers even when information is partially available.
            
            Here's the document text:
            
            ${text.substring(0, 15000)} 
            
            Respond only with a JSON object containing the structured data.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.4,
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
    
    // Ensure metadata fields aren't empty with generic fallbacks
    if (!result.title || result.title.trim() === '') {
      result.title = 'Unknown RFP Title';
    }
    
    if (!result.agency || result.agency.trim() === '') {
      result.agency = 'Not specified';
    }
    
    if (!result.rfpNumber || result.rfpNumber.trim() === '') {
      result.rfpNumber = 'N/A';
    }
    
    if (!result.dueDate || result.dueDate.trim() === '') {
      result.dueDate = 'Not specified';
    }
    
    if (!result.contactPerson || result.contactPerson.trim() === '') {
      result.contactPerson = 'Not specified';
    }
    
    if (!result.estimatedValue || result.estimatedValue.trim() === '') {
      result.estimatedValue = 'Not specified';
    }
    
    if (!result.contractTerm || result.contractTerm.trim() === '') {
      result.contractTerm = 'Not specified';
    }
    
    // Ensure we have at least one key date
    if (!result.keyDates || !Array.isArray(result.keyDates) || result.keyDates.length === 0) {
      result.keyDates = [
        { 
          event: 'No specific dates found in document', 
          date: 'N/A', 
          icon: 'question',
          passed: false 
        }
      ];
    }
    
    return result;
  } catch (error: any) {
    console.error("Error analyzing document with OpenAI:", error);
    throw new Error(`Failed to analyze document: ${error.message || 'Unknown error'}`);
  }
}
