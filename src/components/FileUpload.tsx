
import React, { useState, useRef } from 'react';
import { Upload, File, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { parseResume } from '@/services/api';

interface FileUploadProps {
  onFileProcessed: (parsedData: any) => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const fileType = selectedFile.type;
    
    // Only accept PDF and DOCX files
    if (fileType !== 'application/pdf' && 
        fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    processFile(selectedFile);
  };

// In FileUpload.tsx, modify the processFile function:
const processFile = async (selectedFile: File) => {
  setIsProcessing(true);
  setProgress(0);
  
  // Simulate initial progress
  const progressInterval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 90) {
        clearInterval(progressInterval);
        return 90;
      }
      return prev + 5;
    });
  }, 100);
  
  try {
    // Call the actual API to parse the resume
    const parsedData = await parseResume(selectedFile);
    
    // Complete progress
    clearInterval(progressInterval);
    setProgress(100);
    setIsProcessing(false);
    
    // Pass the raw API response directly
    onFileProcessed(parsedData);
    
    toast({
      title: "Resume processed!",
      description: "Successfully extracted resume information.",
      variant: "default"
    });
  } catch (error) {
    clearInterval(progressInterval);
    setIsProcessing(false);
    setProgress(0);
    console.error("Error processing resume:", error);
    
    toast({
      title: "Processing failed",
      description: "There was an error processing your resume. Please try again.",
      variant: "destructive"
    });
  }
};


  const removeFile = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-primary bg-blue-50' : 'border-gray-300 hover:border-blue-primary'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <Upload className="h-8 w-8 text-blue-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Upload Resume</h3>
              <p className="text-sm text-neutral-gray mt-1">
                Drag and drop your resume file here or click to browse
              </p>
              <p className="text-xs text-neutral-gray mt-1">
                Supported formats: PDF, DOCX
              </p>
            </div>
            <Button 
              type="button" 
              onClick={triggerFileInput}
              className="bg-blue-primary hover:bg-blue-primary/90"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-md mr-3">
                <File className="h-5 w-5 text-blue-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-neutral-gray">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={isProcessing}
              className="text-neutral-gray hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Processing</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-3 flex items-center">
            {isProcessing ? (
              <div className="flex items-center text-sm text-neutral-gray">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Processing resume...</span>
              </div>
            ) : progress === 100 ? (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-2" />
                <span>Processing complete</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}