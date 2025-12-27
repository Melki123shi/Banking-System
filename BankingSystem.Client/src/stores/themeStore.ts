import { create } from "zustand"

interface ThemeState {
  isDarkMode: boolean
  toggleDarkMode: () => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: localStorage.getItem("darkMode") === "true" ? true : false,
  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode
      localStorage.setItem("darkMode", String(newDarkMode))
      return { isDarkMode: newDarkMode }
    }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))