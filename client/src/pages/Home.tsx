import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Document } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingIndicator } from "@/components/ProcessingIndicator";
import { DocumentResults } from "@/components/DocumentResults";
import { OriginalDocument } from "@/components/OriginalDocument";
import { ProcessingState } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { FileUp, LayoutDashboard, ArrowRight, CheckCircle, ListChecks } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Query to fetch the current document
  const { data: currentDocument, isLoading: isLoadingDocument } = useQuery<Document>({
    queryKey: [currentDocumentId ? `/api/documents/${currentDocumentId}` : null],
    enabled: !!currentDocumentId,
  });
  
  // Mutation to upload a document
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Set processing state to uploading
      setProcessingState({
        status: 'uploading',
        progress: 0,
        message: 'Uploading your document...'
      });
      
      // Start a progress simulation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress > 90) {
          clearInterval(interval);
          return;
        }
        
        setProcessingState(prev => ({
          ...prev,
          progress: progress,
          message: progress < 30 
            ? 'Uploading your document...' 
            : progress < 60 
              ? 'Extracting document contents...' 
              : 'Analyzing document with AI...'
        }));
      }, 300);
      
      try {
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }
        
        // Clear the interval
        clearInterval(interval);
        
        // Set processing state to success
        setProcessingState({
          status: 'success',
          progress: 100,
          message: 'Document processed successfully!'
        });
        
        return await response.json();
      } catch (error: any) {
        // Clear the interval
        clearInterval(interval);
        
        // Set processing state to error
        setProcessingState({
          status: 'error',
          progress: 0,
          message: `Error: ${error.message || 'Upload failed'}`
        });
        
        throw error;
      }
    },
    onSuccess: (data) => {
      // Set the current document ID
      setCurrentDocumentId(data.id);
      
      // Invalidate the document query
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${data.id}`] });
      
      // Show success toast
      toast({
        title: "Document Processed",
        description: "Your document has been successfully processed.",
      });
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      
      toast({
        title: "Error Processing Document",
        description: error.message || "There was an error processing your document.",
        variant: "destructive",
      });
    }
  });

  // Add effect to redirect to opportunity detail page when document is processed
  useEffect(() => {
    if (currentDocument && currentDocument.id && currentDocument.processed) {
      // Redirect after a short delay to show success message
      const redirectTimer = setTimeout(() => {
        setLocation(`/opportunities/${currentDocument.id}`);
      }, 2000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [currentDocument, setLocation]);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    uploadMutation.mutate(file);
  };

  const isProcessing = processingState.status === 'uploading' || processingState.status === 'processing';
  const hasResults = currentDocument && currentDocument.processed;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        {!isProcessing && !hasResults && (
          <div className="mb-12 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              TenderLens: RFP Analysis Made Simple
            </h1>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto mb-8">
              Analyze RFP documents in seconds. Extract key information, identify requirements, 
              and make data-driven bid decisions with AI-powered insights.
            </p>
            
            <div className="flex justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => document.getElementById('file-upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <FileUp size={18} />
                Upload RFP Document
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={() => setLocation('/dashboard')}
              >
                <LayoutDashboard size={18} />
                View Dashboard
              </Button>
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
              <div className="p-6 rounded-lg border border-neutral-200 bg-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Document Processing</h3>
                <p className="text-neutral-700">
                  Upload PDFs or Word documents and automatically extract structured data with AI.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-neutral-200 bg-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ListChecks className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Requirements Extraction</h3>
                <p className="text-neutral-700">
                  Automatically identify and categorize technical and qualification requirements.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-neutral-200 bg-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Opportunity Score</h3>
                <p className="text-neutral-700">
                  Get an AI-generated opportunity score to help prioritize your bid/no-bid decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      
        {/* File Upload Section - only show if no document is being processed or shown */}
        {!isProcessing && !hasResults && (
          <div id="file-upload-section" className="mb-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Upload RFP Document</h2>
            <p className="text-neutral-700 mb-4">Upload a PDF or Word document to extract key information and analyze opportunities.</p>
            <FileUploader onFileSelected={handleFileSelected} />
          </div>
        )}
        
        {/* Processing Indicator - show when processing */}
        {isProcessing && <ProcessingIndicator state={processingState} />}
        
        {/* Results Section - show when document is processed */}
        {hasResults && (
          <div id="results-section" className="max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Document Processed Successfully</h3>
                  <p className="text-green-700 text-sm">Redirecting to detailed analysis...</p>
                </div>
              </div>
              <Button 
                onClick={() => setLocation(`/opportunities/${currentDocument?.id}`)}
                variant="outline"
                className="flex items-center gap-2"
              >
                View Details <ArrowRight size={16} />
              </Button>
            </div>
            <DocumentResults document={currentDocument} />
            <OriginalDocument document={currentDocument} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
