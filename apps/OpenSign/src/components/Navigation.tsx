import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import signiaLogo from "@/assets/signia-logo.png";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={signiaLogo} 
              alt="Signia logo" 
              className="w-10 h-10 rounded-xl"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Signia</h1>
              <p className="text-xs text-muted-foreground font-handwriting">Digital Signatures</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#security" className="text-muted-foreground hover:text-primary transition-colors">Security</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Welcome back!</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleAuthClick}
                  className="text-muted-foreground hover:text-primary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={handleAuthClick}
                  className="text-muted-foreground hover:text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  className="btn-warm"
                  onClick={handleAuthClick}
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};