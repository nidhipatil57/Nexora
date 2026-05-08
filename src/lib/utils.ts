import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const CAREER_CATEGORIES = [
  "Technology", "Healthcare", "Finance", "Engineering", "Design",
  "Marketing", "Education", "Science", "Arts", "Business",
  "Legal", "Media", "Agriculture", "Manufacturing", "Government",
];

export const SKILL_CATEGORIES = [
  "Technical", "Soft Skills", "Leadership", "Creative",
  "Analytical", "Communication", "Management",
];

export const PERSONALITY_TYPES = [
  { id: "analytical", label: "Analytical Thinker", icon: "🧠" },
  { id: "creative", label: "Creative Visionary", icon: "🎨" },
  { id: "leader", label: "Natural Leader", icon: "👑" },
  { id: "helper", label: "People Helper", icon: "🤝" },
  { id: "builder", label: "Strategic Builder", icon: "🏗️" },
  { id: "explorer", label: "Curious Explorer", icon: "🔍" },
];
