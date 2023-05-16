import { User } from "@sonamusica-fe/types";
import { setLocalStorage } from "@sonamusica-fe/utils/BrowserUtil";
import create from "zustand";

type AppState = {
  drawerOpen: boolean;
  isAppLoading: boolean;
  isLoading: boolean;
  isDark: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  appFinishLoading: () => void;
  startLoading: () => void;
  finishLoading: () => void;
  toggleDarkMode: () => void;
  turnOnDarkMode: () => void;
  turnOffDarkMode: () => void;
};

type UserState = {
  user: User | undefined;
  setUser: (newUser?: User) => void;
  logout: () => void;
};

export const useApp = create<AppState>((set, get) => ({
  drawerOpen: true,
  isAppLoading: true,
  isLoading: false,
  isDark: false,
  toggleDrawer: () => set({ drawerOpen: !get().drawerOpen }),
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  appFinishLoading: () => set({ isAppLoading: false }),
  startLoading: () => set({ isLoading: true }),
  finishLoading: () => set({ isLoading: false }),
  toggleDarkMode: () => {
    const newDark = !get().isDark;
    set({ isDark: newDark });
    setLocalStorage("dark", newDark ? "true" : "false");
    document.body.className = newDark ? "dark" : "";
  },
  turnOnDarkMode: () => {
    set({ isDark: true });
    setLocalStorage("dark", "true");
    document.body.className = "dark";
  },
  turnOffDarkMode: () => {
    set({ isDark: false });
    setLocalStorage("dark", "false");
    document.body.className = "";
  }
}));

export const useUser = create<UserState>((set) => ({
  user: undefined,
  setUser: (newUser?: User) => set({ user: newUser }),
  logout: () => set({ user: undefined })
}));
