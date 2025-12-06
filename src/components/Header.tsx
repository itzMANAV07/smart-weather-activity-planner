import { Moon, Sun, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  onLocationDetected: (location: string) => void;
  onSearch: () => void;
}

export const Header = ({ onLocationDetected, onSearch }: HeaderProps) => {
  const [isDark, setIsDark] = useState(true);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    // Set dark mode as default on initial load
    document.documentElement.classList.add('dark');
    setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown';
          onLocationDetected(city);
          setTimeout(() => onSearch(), 100);
        } catch {
          onLocationDetected(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">WeatherPlanner</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={detectLocation}
            disabled={detecting}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            {detecting ? "Detecting..." : "My Location"}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
