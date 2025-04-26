import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  FileText,
  FileCog,
  ListChecks,
  FileQuestion,
  Calendar,
  Building,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getOpportunityRating, getOpportunityColor, nullSafeOpportunityScore } from "@/lib/types";
import { DocumentResults } from "@/components/DocumentResults";
import { OriginalDocument } from "@/components/OriginalDocument";

// This will be updated in future PR
const ExplainerTab = ({ document }: { document: Document }) => {
  // Safely extract insights
  const keyInsights = document.aiAnalysis?.keyInsights || [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700">
            {keyInsights[0] || "AI analysis will generate a detailed project overview here."}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Core Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700">
            {keyInsights.length > 1 ? (
              keyInsights.slice(1, 3).map((insight, index) => (
                <li key={index}>{insight}</li>
              ))
            ) : (
              <li>AI analysis will extract the key objectives from the RFP document.</li>
            )}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Scope of Work</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700">
            {keyInsights[3] || "The AI will summarize the scope of work based on the RFP requirements."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// This will be updated in future PR
const RequirementsTab = ({ document }: { document: Document }) => {
  // Safely extract arrays with complete null checking
  const technicalReqs = document.requirements?.technical || [];
  const qualificationReqs = document.requirements?.qualifications || [];
  
  // Calculate totals
  const totalRequirements = technicalReqs.length + qualificationReqs.length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-neutral-900">Requirements</h2>
          <Badge variant="outline">
            {totalRequirements} Total
          </Badge>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <FileCog className="h-4 w-4" />
          Generate Requirements
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Technical Requirements</CardTitle>
            <Badge variant="outline" className="ml-2">
              {technicalReqs.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {technicalReqs.length > 0 ? (
            <ul className="space-y-3">
              {technicalReqs.map((req, index) => (
                <li key={index} className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
                  <div className="flex justify-between">
                    <div className="flex-1">{req}</div>
                    <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">PENDING</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <ListChecks className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
              <p>No technical requirements extracted yet</p>
              <p className="text-sm">Generate requirements to extract from the document</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Qualification Requirements</CardTitle>
            <Badge variant="outline" className="ml-2">
              {qualificationReqs.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {qualificationReqs.length > 0 ? (
            <ul className="space-y-3">
              {qualificationReqs.map((req, index) => (
                <li key={index} className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
                  <div className="flex justify-between">
                    <div className="flex-1">{req}</div>
                    <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">PENDING</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <ListChecks className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
              <p>No qualification requirements extracted yet</p>
              <p className="text-sm">Generate requirements to extract from the document</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  // Query to fetch the current document
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: [`/api/documents/${id}`],
    enabled: !!id,
  });
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Opportunity Not Found</h2>
            <p className="text-neutral-700 mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/dashboard")}>Return to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 mb-4"
            onClick={() => setLocation("/dashboard")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-1">
                {document.title || document.fileName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-700">
                {document.agency && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{document.agency}</span>
                  </div>
                )}
                
                {document.rfpNumber && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>RFP #{document.rfpNumber}</span>
                  </div>
                )}
                
                {document.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(document.dueDate)}</span>
                  </div>
                )}
                
                {document.estimatedValue && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{document.estimatedValue}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              {document.opportunityScore !== undefined && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white font-medium", 
                    nullSafeOpportunityScore(document.opportunityScore) >= 70 ? "bg-success" : 
                    nullSafeOpportunityScore(document.opportunityScore) >= 40 ? "bg-warning" : "bg-destructive"
                  )}>
                    {nullSafeOpportunityScore(document.opportunityScore)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{getOpportunityRating(nullSafeOpportunityScore(document.opportunityScore))}</p>
                    <p className="text-neutral-600">Opportunity</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="explainer" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              Explainer
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Requirements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <DocumentResults document={document} />
          </TabsContent>
          
          <TabsContent value="documents">
            <OriginalDocument document={document} />
          </TabsContent>
          
          <TabsContent value="explainer">
            <ExplainerTab document={document} />
          </TabsContent>
          
          <TabsContent value="requirements">
            <RequirementsTab document={document} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}