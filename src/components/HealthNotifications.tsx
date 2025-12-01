import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, CheckCircle2 } from "lucide-react";

interface HealthNotification {
  type: string;
  severity: string;
  title: string;
  message: string;
  bestWindow?: string | null;
}

interface OptimalWindow {
  type: string;
  title: string;
  message: string;
  timeWindow: string;
}

interface HealthNotificationsProps {
  notifications: HealthNotification[];
  optimalWindows: OptimalWindow[];
}

export const HealthNotifications = ({ notifications, optimalWindows }: HealthNotificationsProps) => {
  if (notifications.length === 0 && optimalWindows.length === 0) return null;

  const getSeverityVariant = (severity: string): "default" | "destructive" => {
    return severity === "alert" ? "destructive" : "default";
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-2 shadow-medium animate-in fade-in slide-in-from-top-4 duration-700">
      <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Bell className="h-6 w-6 text-primary" />
        Health & Safety Notifications
      </h3>
      
      <div className="space-y-3">
        {/* Optimal Windows - Show these first as they're positive */}
        {optimalWindows.map((window, index) => (
          <Alert key={`window-${index}`} className="bg-green-500/10 border-green-500/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <AlertTitle className="font-semibold text-green-700">{window.title}</AlertTitle>
                <AlertDescription className="mt-1 text-green-800/90">{window.message}</AlertDescription>
                {window.timeWindow && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{window.timeWindow}</span>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}

        {/* Health Notifications */}
        {notifications.map((notification, index) => (
          <Alert key={`notification-${index}`} variant={getSeverityVariant(notification.severity)}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTitle className="font-semibold">{notification.title}</AlertTitle>
                  <Badge variant={notification.severity === "alert" ? "destructive" : "secondary"} className="text-xs">
                    {notification.type.toUpperCase()}
                  </Badge>
                </div>
                <AlertDescription className="mt-1">{notification.message}</AlertDescription>
                {notification.bestWindow && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Best time: {notification.bestWindow}</span>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </Card>
  );
};
