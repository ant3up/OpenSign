import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Users, Settings, LogOut, Info, DollarSign, Shield, Plus, FolderOpen, Clock, CheckCircle, Eye, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UploadSection } from '@/components/UploadSection';
import { useState, useEffect } from 'react';
import Parse from '@/lib/parse';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'pending' | 'completed' | 'draft';
  createdAt: Date;
  signers?: number;
}

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      const Document = Parse.Object.extend('contracts_Document');
      const query = new Parse.Query(Document);
      query.equalTo('ExtUserPtr', user);
      query.descending('createdAt');
      query.limit(10);
      
      const results = await query.find();
      
      const docs: Document[] = results.map(doc => ({
        id: doc.id,
        name: doc.get('DocumentName') || 'Untitled Document',
        size: doc.get('FileSize') || 0,
        type: doc.get('FileType') || 'application/pdf',
        url: doc.get('DocumentUrl') || '',
        status: doc.get('IsCompleted') ? 'completed' : doc.get('IsDeclined') ? 'draft' : 'pending',
        createdAt: doc.createdAt,
        signers: doc.get('Signers')?.length || 0
      }));
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (user && !showUpload) {
      fetchDocuments();
    }
  }, [user, showUpload]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getStatusCounts = () => {
    const pending = documents.filter(doc => doc.status === 'pending').length;
    const completed = documents.filter(doc => doc.status === 'completed').length;
    const drafts = documents.filter(doc => doc.status === 'draft').length;
    return { pending, completed, drafts };
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType.includes('image')) return <FileText className="w-6 h-6 text-blue-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const handleViewDocument = (doc: Document) => {
    window.open(doc.url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (showUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">OpenSign</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setShowUpload(false)}>
                  Back to Dashboard
                </Button>
                <span className="text-sm text-gray-600">
                  Welcome, {user.get('fullName') || user.get('email')}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Upload Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h2>
            <p className="text-gray-600">Upload a document to get started with electronic signatures</p>
          </div>
          <UploadSection onUploadComplete={fetchDocuments} />
        </main>
      </div>
    );
  }

  const { pending, completed, drafts } = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">OpenSign</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Button variant="ghost" size="sm" onClick={() => navigate('/how-it-works')}>
                  <Info className="w-4 h-4 mr-2" />
                  How it Works
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/security')}>
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Button>
              </nav>
              <span className="text-sm text-gray-600">
                Welcome, {user.get('fullName') || user.get('email')}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your documents and signatures</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowUpload(true)}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Upload Document</CardTitle>
              <CardDescription>Upload a new document for signing</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">My Documents</CardTitle>
              <CardDescription>View and manage your documents</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Team Members</CardTitle>
              <CardDescription>Manage your team and permissions</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Configure your account settings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Document Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-blue-600">{pending}</span>
              </div>
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Documents waiting for signatures</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-green-600">{completed}</span>
              </div>
              <CardTitle className="text-lg">Completed</CardTitle>
              <CardDescription>Fully signed documents</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-orange-600">{drafts}</span>
              </div>
              <CardTitle className="text-lg">Drafts</CardTitle>
              <CardDescription>Documents in progress</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Documents */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your recently uploaded documents</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowUpload(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingDocs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading documents...</p>
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.signers} signers • {doc.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No documents yet</p>
                <p className="text-sm">Upload your first document to get started</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent document activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Upload your first document to get started</p>
              <Button 
                className="mt-4" 
                onClick={() => setShowUpload(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
