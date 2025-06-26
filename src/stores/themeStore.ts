import { Theme } from "@/types/context";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

function handleThemeChange(theme: Theme) {
  localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", theme === Theme.DARK);
}

const initialTheme =
  (localStorage.getItem("theme") as Theme) ||
  (window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Theme.DARK
    : Theme.LIGHT);

const useThemeStore = create(
  subscribeWithSelector<ThemeStore>((set) => ({
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => ({
        theme: state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
      })),
  }))
);

handleThemeChange(initialTheme);

useThemeStore.subscribe(
  (state) => state.theme,
  (theme) => {
    handleThemeChange(theme);
  }
);

export default useThemeStore;
