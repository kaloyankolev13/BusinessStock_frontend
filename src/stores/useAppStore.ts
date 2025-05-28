import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: string;
  
  // User preferences
  itemsPerPage: number;
  defaultCurrency: string;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  setItemsPerPage: (count: number) => void;
  setDefaultCurrency: (currency: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarCollapsed: false,
      theme: 'light',
      language: 'en',
      itemsPerPage: 20,
      defaultCurrency: 'USD',
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setItemsPerPage: (count) => set({ itemsPerPage: count }),
      setDefaultCurrency: (currency) => set({ defaultCurrency: currency }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        itemsPerPage: state.itemsPerPage,
        defaultCurrency: state.defaultCurrency,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
); 