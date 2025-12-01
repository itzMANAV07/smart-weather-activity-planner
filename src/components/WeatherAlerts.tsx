import { Card } from "@/components/ui/card";
import { AlertTriangle, CloudRain, Wind, Snowflake, Thermometer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WeatherAlert {
  type: string;
  severity: "warning" | "severe" | "extreme";
  title: string;
  description: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (alerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('rain')) return <CloudRain className="h-5 w-5" />;
    if (typeLower.includes('wind')) return <Wind className="h-5 w-5" />;
    if (typeLower.includes('snow')) return <Snowflake className="h-5 w-5" />;
    if (typeLower.includes('temp') || typeLower.includes('heat') || typeLower.includes('cold')) {
      return <Thermometer className="h-5 w-5" />;
    }
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getSeverityVariant = (severity: string): "default" | "destructive" => {
    return severity === "extreme" || severity === "severe" ? "destructive" : "default";
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-2 shadow-medium animate-in fade-in slide-in-from-top-4 duration-700">
      <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        Weather Alerts
      </h3>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={getSeverityVariant(alert.severity)}>
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <AlertTitle className="font-semibold">{alert.title}</AlertTitle>
                <AlertDescription className="mt-1">{alert.description}</AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </Card>
  );
};
