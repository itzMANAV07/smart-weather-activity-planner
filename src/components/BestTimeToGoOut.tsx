import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, XCircle, Leaf } from "lucide-react";

interface BestTimeSlot {
  time: string;
  aqi: number;
  aqiCategory: string;
  recommendation: string;
}

interface BestTimeToGoOutProps {
  currentAqi: number;
  currentAqiCategory: string;
  bestTimeSlots: BestTimeSlot[];
}

const getAqiStatusColor = (category: string) => {
  switch (category) {
    case 'Good': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    case 'Moderate': return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    case 'Unhealthy for Sensitive Groups': return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30';
    default: return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
  }
};

const getAqiIcon = (category: string) => {
  switch (category) {
    case 'Good': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'Moderate': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default: return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const getAqiBarWidth = (aqi: number) => Math.min(100, (aqi / 300) * 100);

const getAqiBarColor = (aqi: number) => {
  if (aqi <= 50) return 'bg-emerald-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  return 'bg-red-500';
};

export const BestTimeToGoOut = ({ currentAqi, currentAqiCategory, bestTimeSlots }: BestTimeToGoOutProps) => {
  const bestSlot = bestTimeSlots.length > 0 ? bestTimeSlots[0] : null;

  return (
    <Card className="p-6 bg-card border border-border/50 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Best Time to Go Out</h3>
          <p className="text-sm text-muted-foreground">Based on air quality forecast</p>
        </div>
      </div>

      {/* Current AQI Summary */}
      <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Current AQI</span>
          <Badge className={`${getAqiStatusColor(currentAqiCategory)} border text-xs font-medium`}>
            {currentAqiCategory}
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{currentAqi}</span>
          <span className="text-sm text-muted-foreground">/ 300</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getAqiBarColor(currentAqi)}`}
            style={{ width: `${getAqiBarWidth(currentAqi)}%` }}
          />
        </div>
      </div>

      {/* Best Time Recommendation */}
      {bestSlot && (
        <div className="mb-5 p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Recommended: {bestSlot.time}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{bestSlot.recommendation}</p>
        </div>
      )}

      {/* Time Slots */}
      <div className="space-y-2">
        {bestTimeSlots.map((slot, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              index === 0
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-muted/20 hover:bg-muted/40'
            }`}
          >
            {getAqiIcon(slot.aqiCategory)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{slot.time}</p>
              <p className="text-xs text-muted-foreground truncate">{slot.recommendation}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-foreground">{slot.aqi}</p>
              <p className="text-xs text-muted-foreground">AQI</p>
            </div>
          </div>
        ))}
      </div>

      {bestTimeSlots.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <XCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No favorable outdoor windows found today.</p>
          <p className="text-xs mt-1">Consider indoor activities instead.</p>
        </div>
      )}
    </Card>
  );
};
