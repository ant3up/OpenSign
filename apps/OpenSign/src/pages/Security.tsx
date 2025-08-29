import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, FileText, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Security = () => {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All documents are encrypted using AES-256 encryption both in transit and at rest.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "SOC 2 Type II Compliant",
      description: "Our security practices are independently audited and certified annually.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Complete Audit Trail",
      description: "Every action is logged with timestamps, IP addresses, and user information.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: "Legally Binding",
      description: "Compliant with e-signature laws including ESIGN, UETA, and GDPR.",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const complianceStandards = [
    {
      name: "SOC 2 Type II",
      description: "Annual security audit certification",
      status: "Certified"
    },
    {
      name: "GDPR",
      description: "European data protection compliance",
      status: "Compliant"
    },
    {
      name: "CCPA",
      description: "California privacy law compliance",
      status: "Compliant"
    },
    {
      name: "HIPAA",
      description: "Healthcare data protection",
      status: "Compliant"
    },
    {
      name: "ISO 27001",
      description: "Information security management",
      status: "Certified"
    },
    {
      name: "PCI DSS",
      description: "Payment card industry security",
      status: "Compliant"
    }
  ];

  const securityMeasures = [
    {
      title: "Data Encryption",
      description: "AES-256 encryption for all data at rest and in transit"
    },
    {
      title: "Access Controls",
      description: "Role-based access control with multi-factor authentication"
    },
    {
      title: "Regular Security Audits",
      description: "Third-party security assessments conducted annually"
    },
    {
      title: "Secure Infrastructure",
      description: "Hosted on AWS with enterprise-grade security"
    },
    {
      title: "Backup & Recovery",
      description: "Automated backups with 99.9% uptime guarantee"
    },
    {
      title: "Incident Response",
      description: "24/7 security monitoring and rapid response team"
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
              <h1 className="text-xl font-bold text-gray-900">Signia</h1>
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
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Security
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your documents and data are protected by industry-leading security measures and compliance standards.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className={`${feature.color} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Compliance Standards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Compliance & Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceStandards.map((standard, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{standard.name}</CardTitle>
                    <Badge 
                      variant={standard.status === "Certified" ? "default" : "secondary"}
                      className="bg-green-100 text-green-800"
                    >
                      {standard.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{standard.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Measures */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Security Measures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMeasures.map((measure, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{measure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{measure.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Trusted by Thousands of Organizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">Guaranteed service availability</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Zero Data Breaches</h3>
              <p className="text-gray-600">Proven security track record</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Monitoring</h3>
              <p className="text-gray-600">Continuous security oversight</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Secure Signing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of organizations who trust Signia with their sensitive documents.
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

export default Security;
