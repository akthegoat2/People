"use client";

import {
  Moon, Landmark, BookOpen, Globe, Scale, Sunrise, Rainbow,
  Shirt, Brain, Microscope, Clapperboard, Tv, Heart, Palette,
  Sparkles, Hexagon, Crown,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Moon, Landmark, BookOpen, Globe, Scale, Sunrise, Rainbow,
  Shirt, Brain, Microscope, Clapperboard, Tv, Heart, Palette,
  Sparkles, Hexagon, Crown, Venus: Crown,
};

export function CoreIcon({ name, className, size = 18 }: { name: string; className?: string; size?: number }) {
  const Icon = MAP[name] ?? Hexagon;
  return <Icon size={size} className={className} aria-hidden />;
}
