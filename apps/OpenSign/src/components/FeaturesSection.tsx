import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PenTool, 
  Shield, 
  Smartphone, 
  Users, 
  Clock, 
  Globe,
  FileCheck,
  Zap,
  Heart
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "Intuitive Signature Experience",
    description: "Drag, drop, and sign with our friendly interface that feels as natural as pen and paper.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your documents are protected with enterprise-grade encryption and compliance certifications.",
    color: "text-secondary"
  },
  {
    icon: Smartphone,
    title: "Sign Anywhere, Anytime",
    description: "Perfect experience across desktop, tablet, and mobile. Sign on the go or at your desk.",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Multi-Party Workflows",
    description: "Manage complex signing orders with multiple signers, notifications, and reminders.",
    color: "text-purple-500"
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description: "See exactly when documents are viewed, signed, and completed with beautiful status updates.",
    color: "text-orange-500"
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "Legally binding signatures that meet ESIGN, eIDAS, and international standards.",
    color: "text-blue-500"
  },
  {
    icon: FileCheck,
    title: "Smart Document Fields",
    description: "Add signature, date, text, and checkbox fields with intelligent auto-detection.",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get documents signed in minutes, not days. Streamline your workflow with automation.",
    color: "text-yellow-500"
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every detail crafted to create moments of delight in your document workflow.",
    color: "text-pink-500"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need for
            <span className="text-primary font-handwriting text-4xl md:text-5xl block mt-2">
              delightful signatures
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From simple one-off signatures to complex multi-party workflows, 
            we've built every feature with warmth and human-centered design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-warm hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-warm flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};