import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { UploadSection } from "@/components/UploadSection";
import { Footer } from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <UploadSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
