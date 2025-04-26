import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { CloudUploadIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, isValidFileType } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

export function FileUploader({ onFileSelected }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFile = (file: File) => {
    if (isValidFileType(file)) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF or DOCX file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={`dropzone rounded-lg p-8 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
        isDragging ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-primary hover:bg-primary/5"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !selectedFile && handleBrowseClick()}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-primary mb-4">
          {selectedFile ? (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <CloudUploadIcon className="h-16 w-16" />
          )}
        </div>
        
        {selectedFile ? (
          <div>
            <p className="text-lg font-medium text-neutral-900 mb-2">File selected</p>
            <p className="text-sm text-neutral-700">{selectedFile.name}</p>
            <p className="text-sm text-neutral-700">({formatFileSize(selectedFile.size)})</p>
          </div>
        ) : (
          <>
            <p className="text-lg font-medium text-neutral-900 mb-2">Drag and drop your document here</p>
            <p className="text-neutral-700 mb-4">or</p>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
            >
              Browse Files
            </Button>
            <p className="mt-3 text-sm text-neutral-700">Supported formats: PDF, DOCX</p>
          </>
        )}
      </div>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef}
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        onChange={handleFileChange}
      />
    </div>
  );
}
