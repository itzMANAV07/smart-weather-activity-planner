import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Sun, TrendingUp, AlertCircle } from "lucide-react";

interface HealthMetricsProps {
  aqi: number;
  aqiCategory: string;
  uvIndex: number;
  uvCategory: string;
}

export const HealthMetrics = ({ 
  aqi, 
  aqiCategory, 
  uvIndex, 
  uvCategory
}: HealthMetricsProps) => {
  const getAQIColor = (category: string) => {
    switch (category) {
      case 'Good': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Unhealthy for Sensitive Groups': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'Unhealthy': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
    }
  };

  const getUVColor = (category: string) => {
    switch (category) {
      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'Very High': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
    }
  };


  return (
    <Card className="p-8 bg-gradient-card backdrop-blur-sm border-2 border-primary/20 shadow-glow animate-in fade-in slide-in-from-top-4 duration-700">
      <h3 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-accent">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        Air Quality Index
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AQI Card */}
        <div className="bg-background/60 rounded-2xl p-6 border-2 border-primary/10 hover:border-primary/30 transition-smooth hover:shadow-medium">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Air Quality</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground">{aqi}</span>
            <span className="text-sm text-muted-foreground">AQI</span>
          </div>
          <Badge className={`${getAQIColor(aqiCategory)} border font-medium`}>
            {aqiCategory}
          </Badge>
          {aqi > 100 && (
            <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                {aqi > 150 
                  ? 'Avoid prolonged outdoor exposure' 
                  : 'Sensitive groups should limit outdoor activities'}
              </span>
            </div>
          )}
        </div>

        {/* UV Index Card */}
        <div className="bg-background/60 rounded-2xl p-6 border-2 border-primary/10 hover:border-primary/30 transition-smooth hover:shadow-medium">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">UV Index</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground">{uvIndex}</span>
            <span className="text-sm text-muted-foreground">of 11+</span>
          </div>
          <Badge className={`${getUVColor(uvCategory)} border font-medium`}>
            {uvCategory}
          </Badge>
          {uvIndex >= 6 && (
            <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>Wear SPF 30+ and protective clothing</span>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
};
