/**
 * Keynote — Core Type Definitions
 * Phase 1 Foundation & Design System
 */

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface FeatureCardData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: "analysis" | "theory" | "audio-lab";
  status: "In Development" | "Planned" | "Preview";
  targetRoute: string;
  capabilities: string[];
}

export interface RoadmapMilestone {
  phase: string;
  title: string;
  description: string;
  status: "current" | "upcoming" | "planned";
  items: string[];
}

export interface MusicalMetric {
  label: string;
  value: string;
  subtext?: string;
}
