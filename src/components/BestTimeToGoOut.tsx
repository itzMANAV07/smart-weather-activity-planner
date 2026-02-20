import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, XCircle, Leaf } from "lucide-react";
import { motion } from "framer-motion";

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

      {/* Visual Timeline */}
      <motion.div
        className="relative"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
      >
        {bestTimeSlots.map((slot, index) => {
          const isBest = index === 0;
          return (
            <motion.div
              key={index}
              className="relative flex gap-4"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
            >
              {/* Timeline line & dot */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-3.5 h-3.5 rounded-full border-2 z-10 shrink-0 ${
                    isBest
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : slot.aqiCategory === 'Good'
                        ? 'bg-emerald-500/60 border-emerald-500/40'
                        : slot.aqiCategory === 'Moderate'
                          ? 'bg-yellow-500/60 border-yellow-500/40'
                          : 'bg-red-500/60 border-red-500/40'
                  }`}
                  variants={{
                    hidden: { scale: 0 },
                    visible: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } },
                  }}
                />
                {index < bestTimeSlots.length - 1 && (
                  <motion.div
                    className="w-0.5 flex-1 bg-border/50 min-h-[2rem]"
                    variants={{
                      hidden: { scaleY: 0, originY: 0 },
                      visible: { scaleY: 1, transition: { duration: 0.3, delay: 0.1 } },
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 pb-5 -mt-1 ${
                  index === bestTimeSlots.length - 1 ? 'pb-0' : ''
                }`}
              >
                <div
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    isBest
                      ? 'bg-emerald-500/10 border border-emerald-500/25'
                      : 'bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getAqiIcon(slot.aqiCategory)}
                      <span className={`text-sm font-semibold ${isBest ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                        {slot.time}
                      </span>
                      {isBest && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 border text-[10px] px-1.5 py-0">
                          Best
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground">{slot.aqi} <span className="text-xs font-normal text-muted-foreground">AQI</span></span>
                  </div>
                  {/* Mini AQI bar */}
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getAqiBarColor(slot.aqi)}`}
                      style={{ width: `${getAqiBarWidth(slot.aqi)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{slot.recommendation}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

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
