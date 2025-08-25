import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Image, File, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

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

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Files uploaded successfully! 🎉",
        description: `${validFiles.length} file(s) ready for signing`,
      });
    }

    if (validFiles.length < files.length) {
      toast({
        title: "Some files were skipped",
        description: "We support PDF, Word, and image files only",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType.includes('image')) return <Image className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
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
                  />
                  
                  <label htmlFor="file-upload">
                    <Button className="btn-warm cursor-pointer">
                      Choose Files
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
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/60">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="btn-gentle">
                          Add Signature Fields
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button size="lg" className="btn-warm">
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