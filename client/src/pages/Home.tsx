import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  
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
      } catch (error) {
        // Clear the interval
        clearInterval(interval);
        
        // Set processing state to error
        setProcessingState({
          status: 'error',
          progress: 0,
          message: `Error: ${error.message}`
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
    onError: (error) => {
      console.error("Upload error:", error);
      
      toast({
        title: "Error Processing Document",
        description: error.message || "There was an error processing your document.",
        variant: "destructive",
      });
    }
  });

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
        {/* File Upload Section - only show if no document is being processed or shown */}
        {!isProcessing && !hasResults && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Upload RFP Document</h2>
            <p className="text-neutral-700 mb-4">Upload a PDF or Word document to extract key information and analyze opportunities.</p>
            <FileUploader onFileSelected={handleFileSelected} />
          </div>
        )}
        
        {/* Processing Indicator - show when processing */}
        {isProcessing && <ProcessingIndicator state={processingState} />}
        
        {/* Results Section - show when document is processed */}
        {hasResults && (
          <div id="results-section">
            <DocumentResults document={currentDocument} />
            <OriginalDocument document={currentDocument} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
