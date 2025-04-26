import { Document } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Expand } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OriginalDocumentProps {
  document: Document;
}

export function OriginalDocument({ document }: OriginalDocumentProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  return (
    <>
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 bg-neutral-100 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-neutral-900">Original Document</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary" title="Download Original">
                <Download className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-neutral-700 hover:text-primary" 
                title="View Full Screen"
                onClick={() => setIsFullScreen(true)}
              >
                <Expand className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="bg-neutral-100 rounded-lg p-4 h-64 flex flex-col overflow-auto">
            {document.fullText ? (
              <pre className="text-sm whitespace-pre-wrap text-neutral-700">
                {document.fullText.slice(0, 2000)} 
                {document.fullText.length > 2000 && (
                  <>
                    <span>...</span>
                    <Button 
                      variant="link" 
                      className="text-primary p-0 h-auto mt-2" 
                      onClick={() => setIsFullScreen(true)}
                    >
                      View Full Document
                    </Button>
                  </>
                )}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-700">
                  <span>Document text not available</span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{document.title || document.fileName}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto h-full">
            <pre className="text-sm whitespace-pre-wrap text-neutral-700 p-4">
              {document.fullText}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
