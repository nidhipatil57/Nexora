import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  onboarded: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isNewUser: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isNewUser: false,
      isHydrated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, token: data.token, isLoading: false, isNewUser: false });
            return data;
          }
          set({ isLoading: false });
          return data;
        } catch {
          set({ isLoading: false });
          return { success: false };
        }
      },
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, token: data.token, isLoading: false, isNewUser: true });
            return data;
          }
          set({ isLoading: false });
          return data;
        } catch {
          set({ isLoading: false });
          return { success: false };
        }
      },
      logout: () => set({ user: null, token: null, isNewUser: false }),
      fetchUser: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) set({ user: data.user });
          else set({ user: null, token: null });
        } catch {
          set({ user: null, token: null });
        }
      },
      setHydrated: (val) => set({ isHydrated: val }),
    }),
    { 
      name: "nexora-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);

interface LearningPhase {
  week: string;
  title: string;
  concepts: string[];
  resources: { name: string; type: string; url: string }[];
  hoursEstimate: number;
  goal: string;
}

interface LearningPath {
  totalWeeks: number;
  hoursPerWeek: number;
  phases: LearningPhase[];
  completedPhases: string[];
}

interface AppState {
  sidebarOpen: boolean;
  theme: "dark" | "light";
  isHydrated: boolean;
  learningPlans: Record<string, LearningPath>;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setHydrated: (val: boolean) => void;
  saveLearningPlan: (skillName: string, plan: LearningPath) => void;
  togglePhaseCompletion: (skillName: string, phaseTitle: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "dark",
      isHydrated: false,
      learningPlans: {},
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setHydrated: (val: boolean) => set({ isHydrated: val }),
      saveLearningPlan: (skillName, plan) => set((s) => ({ 
        learningPlans: { ...s.learningPlans, [skillName]: { ...plan, completedPhases: plan.completedPhases || [] } } 
      })),
      togglePhaseCompletion: (skillName, phaseTitle) => set((s) => {
        const plan = s.learningPlans[skillName];
        if (!plan) return s;
        const completed = plan.completedPhases || [];
        const newCompleted = completed.includes(phaseTitle)
          ? completed.filter(t => t !== phaseTitle)
          : [...completed, phaseTitle];
        return {
          learningPlans: {
            ...s.learningPlans,
            [skillName]: { ...plan, completedPhases: newCompleted }
          }
        };
      }),
    }),
    { 
      name: "nexora-app",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
