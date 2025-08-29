import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "5 documents per month",
        "Basic signature fields",
        "Email support",
        "Mobile signing",
        "Standard templates"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Professional",
      price: "$15",
      period: "per month",
      description: "Ideal for growing businesses and teams",
      features: [
        "Unlimited documents",
        "Advanced signature fields",
        "Priority email support",
        "Custom branding",
        "Bulk sending",
        "Audit trails",
        "API access",
        "Team collaboration"
      ],
      popular: true,
      color: "border-blue-500"
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "per month",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Professional",
        "Advanced security features",
        "24/7 phone support",
        "Custom integrations",
        "Advanced analytics",
        "SSO integration",
        "Custom workflows",
        "Dedicated account manager"
      ],
      popular: false,
      color: "border-gray-200"
    }
  ];

  const features = [
    {
      title: "Legally Binding Signatures",
      description: "Compliant with e-signature laws worldwide"
    },
    {
      title: "Real-time Tracking",
      description: "Track document status and signing progress"
    },
    {
      title: "Secure Storage",
      description: "Bank-level encryption for all documents"
    },
    {
      title: "Mobile Friendly",
      description: "Sign documents on any device"
    },
    {
      title: "Audit Trail",
      description: "Complete record of all signing activities"
    },
    {
      title: "Templates",
      description: "Save and reuse document templates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <img src={signiaLogo} alt="Signia" className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Signia</h1>
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.color} hover:shadow-xl transition-shadow ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => navigate('/auth')}
                >
                  {plan.name === "Starter" ? "Get Started Free" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            All Plans Include
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

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who trust Signia for their digital signature needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="bg-card text-primary hover:bg-muted"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/how-it-works')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
