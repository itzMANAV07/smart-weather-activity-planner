import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, CloudFog, CloudDrizzle } from "lucide-react";

interface AnimatedWeatherIconProps {
  condition: string;
  size?: string;
  className?: string;
}

export const AnimatedWeatherIcon = ({ condition, size = "h-8 w-8", className = "" }: AnimatedWeatherIconProps) => {
  const conditionLower = condition.toLowerCase();

  // Sun animation - rotating rays
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={className}
      >
        <Sun className={`${size} text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]`} />
      </motion.div>
    );
  }

  // Rain animation - bouncing drops
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return (
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <CloudRain className={`${size} text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]`} />
      </motion.div>
    );
  }

  // Drizzle animation
  if (conditionLower.includes('drizzle')) {
    return (
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <CloudDrizzle className={`${size} text-blue-300 drop-shadow-[0_0_6px_rgba(147,197,253,0.4)]`} />
      </motion.div>
    );
  }

  // Snow animation - gentle floating
  if (conditionLower.includes('snow')) {
    return (
      <motion.div
        animate={{ y: [0, -4, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <CloudSnow className={`${size} text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.5)]`} />
      </motion.div>
    );
  }

  // Thunder animation - pulsing
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return (
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <CloudLightning className={`${size} text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]`} />
      </motion.div>
    );
  }

  // Wind animation
  if (conditionLower.includes('wind') || conditionLower.includes('breez')) {
    return (
      <motion.div
        animate={{ x: [-2, 2, -2] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <Wind className={`${size} text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]`} />
      </motion.div>
    );
  }

  // Fog/Mist animation - fading
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
    return (
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <CloudFog className={`${size} text-slate-400 drop-shadow-[0_0_6px_rgba(148,163,184,0.4)]`} />
      </motion.div>
    );
  }

  // Cloudy animation - gentle floating
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return (
      <motion.div
        animate={{ x: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        <Cloud className={`${size} text-slate-400 drop-shadow-[0_0_6px_rgba(148,163,184,0.3)]`} />
      </motion.div>
    );
  }

  // Default - sun
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className={className}
    >
      <Sun className={`${size} text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]`} />
    </motion.div>
  );
};
