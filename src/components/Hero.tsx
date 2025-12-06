import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeroProps {
  location: string;
  onLocationChange: (location: string) => void;
  onSearch: () => void;
}

export const Hero = ({ location, onLocationChange, onSearch }: HeroProps) => {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight tracking-tight">
          Smart Weather
          <span className="block bg-gradient-accent bg-clip-text text-transparent mt-2">
            Activity Planner
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Using Cloud Based Application
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-8">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="pl-10 h-12 text-base bg-card/90 backdrop-blur-sm border-2 focus:border-primary transition-smooth shadow-soft"
            />
          </div>
          <Button 
            onClick={onSearch}
            size="lg"
            className="h-12 px-8 bg-gradient-accent hover:shadow-glow shadow-medium transition-smooth font-semibold"
          >
            Get Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};
