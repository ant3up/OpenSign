import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Image, File, ArrowRight, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Parse from '@/lib/parse';
import { useAuth } from '@/hooks/useAuth';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'success' | 'error';
}

interface UploadSectionProps {
  onUploadComplete?: () => void;
}

export const UploadSection = ({ onUploadComplete }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const uploadFileToParse = async (file: File): Promise<UploadedFile> => {
    try {
      // Create a Parse File object
      const parseFile = new Parse.File(file.name, file);
      
      // Save the file to Parse
      const savedFile = await parseFile.save();
      
      // Create a document record in the database
      const Document = Parse.Object.extend('contracts_Document');
      const document = new Document();
      
      document.set('DocumentName', file.name);
      document.set('DocumentUrl', savedFile.url());
      document.set('FileSize', file.size);
      document.set('FileType', file.type);
      document.set('ExtUserPtr', user);
      document.set('CreatedBy', user);
      document.set('IsCompleted', false);
      document.set('IsDeclined', false);
      document.set('IsArchive', false);
      document.set('IsSignyourself', false);
      
      const savedDocument = await document.save();
      
      return {
        id: savedDocument.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: savedFile.url(),
        status: 'success'
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length === 0) {
      toast({
        title: "No valid files",
        description: "We support PDF, Word, and image files only",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Add files to state with uploading status
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    let successCount = 0;

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const tempId = newFiles[i].id;
      
      try {
        const uploadedFile = await uploadFileToParse(file);
        
        // Update the file status
        setUploadedFiles(prev => prev.map(f => 
          f.id === tempId ? uploadedFile : f
        ));
        
        successCount++;
        
        toast({
          title: "File uploaded successfully! 🎉",
          description: `${file.name} is ready for signing`,
        });
      } catch (error) {
        // Update the file status to error
        setUploadedFiles(prev => prev.map(f => 
          f.id === tempId ? { ...f, status: 'error' } : f
        ));
        
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setIsUploading(false);

    // Notify parent component if any files were successfully uploaded
    if (successCount > 0 && onUploadComplete) {
      onUploadComplete();
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType.includes('image')) return <Image className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <File className="w-4 h-4 text-red-500" />;
    }
  };

  const handleAddSignatureFields = (fileId: string) => {
    // TODO: Navigate to signature editor
    toast({
      title: "Coming soon!",
      description: "Signature field editor will be available soon",
    });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start with your document
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload any PDF, Word document, or image. We'll help you add signature fields and send it for signing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="card-warm p-8">
            <CardContent className="p-0">
              <div 
                className={`signature-area p-12 text-center transition-all duration-300 ${
                  isDragging ? 'border-primary bg-primary-light scale-105' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Drag & drop your documents here
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Or click to browse your files
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  
                  <label htmlFor="file-upload">
                    <Button className="btn-warm cursor-pointer" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Choose Files'
                      )}
                    </Button>
                  </label>
                  
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, Word documents, and images (JPG, PNG)
                  </p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Check className="w-5 h-5 text-accent mr-2" />
                    Uploaded Files ({uploadedFiles.length})
                  </h4>
                  
                  <div className="grid gap-3">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/60">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-medium text-foreground">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            {getStatusIcon(file.status)}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="btn-gentle"
                          onClick={() => handleAddSignatureFields(file.id)}
                          disabled={file.status !== 'success'}
                        >
                          Add Signature Fields
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      size="lg" 
                      className="btn-warm"
                      disabled={uploadedFiles.some(f => f.status !== 'success')}
                    >
                      Continue to Signature Setup
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};