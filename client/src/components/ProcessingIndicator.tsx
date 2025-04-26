import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessingState } from "@/lib/types";

interface ProcessingIndicatorProps {
  state: ProcessingState;
}

export function ProcessingIndicator({ state }: ProcessingIndicatorProps) {
  const { status, progress, message } = state;
  
  // Get the right title based on status
  const getTitle = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading Document';
      case 'processing':
        return 'Processing Document';
      case 'success':
        return 'Processing Complete';
      case 'error':
        return 'Processing Error';
      default:
        return 'Processing Document';
    }
  };
  
  // Get the right description based on status
  const getDescription = () => {
    if (message) return message;
    
    switch (status) {
      case 'uploading':
        return 'Uploading your document...';
      case 'processing':
        return 'Extracting document contents...';
      case 'success':
        return 'Document processed successfully!';
      case 'error':
        return 'Error processing document. Please try again.';
      default:
        return 'Processing your document...';
    }
  };
  
  // Calculate the stroke-dashoffset for the SVG circle
  const radius = 26;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <Card className="mb-8 bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="mr-4">
            <svg className="progress-ring" width="60" height="60">
              <circle 
                className="bg" 
                stroke="#E1E1E1" 
                strokeWidth="4" 
                fill="transparent" 
                r={radius} 
                cx="30" 
                cy="30"
              />
              <circle 
                className="text-primary" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="transparent" 
                r={radius} 
                cx="30" 
                cy="30" 
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                  transition: "stroke-dashoffset 0.35s"
                }}
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-neutral-900">{getTitle()}</h3>
            <p className="text-neutral-700">{getDescription()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
