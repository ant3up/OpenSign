import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Loved by 50,000+ users worldwide
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Electronic signatures that feel
              <span className="text-primary font-handwriting text-5xl md:text-6xl lg:text-7xl block mt-2">
                wonderfully human
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Say goodbye to printing, scanning, and mailing. Create legally binding signatures 
              in minutes with our warm, intuitive platform that makes every interaction delightful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="btn-warm text-lg px-8 py-4">
                <Upload className="w-5 h-5 mr-2" />
                Upload & Sign Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="btn-gentle text-lg px-8 py-4">
                Watch Demo (2 min)
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                No credit card required
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                Legally binding
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                Bank-level security
              </div>
            </div>
          </div>
          
          <div className="animate-slide-up lg:pl-12">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="People signing documents digitally in a warm, modern environment"
                className="rounded-2xl shadow-warm w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};