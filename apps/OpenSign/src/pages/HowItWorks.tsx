import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: "Upload Your Document",
      description: "Simply drag and drop your PDF document or click to upload. We support all standard document formats.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Add Signers",
      description: "Enter email addresses of people who need to sign. You can set signing order and add custom fields.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      title: "Place Signature Fields",
      description: "Drag and drop signature fields, initials, dates, and text boxes exactly where you need them.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-orange-600" />,
      title: "Send & Track",
      description: "Send the document for signing and track progress in real-time. Get notified when everyone has signed.",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const features = [
    {
      title: "Legally Binding",
      description: "All signatures are legally binding and compliant with e-signature laws worldwide."
    },
    {
      title: "Real-time Tracking",
      description: "Track document status, view signing progress, and get instant notifications."
    },
    {
      title: "Mobile Friendly",
      description: "Sign documents on any device - desktop, tablet, or mobile phone."
    },
    {
      title: "Secure Storage",
      description: "Your documents are encrypted and stored securely in the cloud."
    },
    {
      title: "Audit Trail",
      description: "Complete audit trail with timestamps and IP addresses for every action."
    },
    {
      title: "Templates",
      description: "Save frequently used documents as templates for quick reuse."
    }
  ];

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
              <Button variant="ghost" onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How OpenSign Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your documents signed in minutes, not days. Our simple 4-step process makes digital signatures effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className={`${step.color} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription className="text-sm">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            The Complete Process
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium mt-2 text-gray-700">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose OpenSign?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of users who trust OpenSign for their digital signature needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
