import { create } from "zustand";
import { load, Store } from "@tauri-apps/plugin-store";

const STORE_NAME = "userStore.json";

interface User {
  uuid: string;
  license?: string;
  startDate: string;
  email?: string;
}

const validateUser = (user: unknown): user is User => {
  return (
    typeof user === "object" &&
    user !== null &&
    "uuid" in user &&
    "startDate" in user
  );
};

export enum GlobalShortcutKey {
  OpenAndPaste = "openAndPaste",
}

const defaultGlobalShortcut = {
  [GlobalShortcutKey.OpenAndPaste]: {
    enabled: true,
    shortcut: "CommandOrControl+Shift+D",
  },
};

interface Settings {
  autoPaste: boolean;
  replaceSingleQuote: boolean;
  globalShortcut: {
    [GlobalShortcutKey.OpenAndPaste]: {
      enabled: boolean;
      shortcut: string;
    };
  };
}

interface UserStore {
  userStore: Store | null;
  user: User | null;
  settings: Settings;
  userCheckOpen: boolean;
  setSettings: (settings: Settings) => void;
  updateGlobalShortcut: (
    key: keyof Settings["globalShortcut"],
    value: boolean
  ) => void;
  resetGlobalShortcut: () => void;
  setUserCheckOpen: (open: boolean) => void;
  initUser: () => Promise<void>;
  initSettings: () => Promise<void>;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set, get) => {
  return {
    userStore: null,
    user: null,
    settings: {
      autoPaste: true,
      replaceSingleQuote: false,
      globalShortcut: defaultGlobalShortcut,
    },
    userCheckOpen: false,
    setSettings: (settings: Settings) => {
      set({ settings });
      get().userStore?.set("settings", settings);
      get().userStore?.save();
    },
    resetGlobalShortcut: () => {
      const { settings, setSettings } = get();

      setSettings({
        ...settings,
        globalShortcut: defaultGlobalShortcut,
      });
    },
    updateGlobalShortcut: (
      key: keyof Settings["globalShortcut"],
      value: boolean
    ) => {
      const { settings, setSettings } = get();
      const globalShortcut = settings.globalShortcut;

      setSettings({
        ...settings,
        globalShortcut: {
          ...globalShortcut,
          [key]: {
            ...globalShortcut[key],
            enabled: value,
          },
        },
      });
    },
    setUserCheckOpen: (open: boolean) => {
      set({ userCheckOpen: open });
    },
    setUser: async (user: User) => {
      set({ user });
      await get().userStore?.set("user", user);
      await get().userStore?.save();
    },
    initUser: async () => {
      const user = await get().userStore?.get("user");

      if (validateUser(user)) {
        get().setUser(user);
      } else {
        const newUser = {
          uuid: crypto.randomUUID(),
          startDate: new Date().toISOString(),
        };
        get().setUser(newUser);
      }
    },
    initSettings: async () => {
      const settings = await get().userStore?.get("settings");

      if (settings) {
        get().setSettings(settings as Settings);
      }
    },
  };
});

const initUserStore = async () => {
  const store = await load(STORE_NAME, { autoSave: false });

  useUserStore.setState({ userStore: store });
  useUserStore.getState().initUser();
  useUserStore.getState().initSettings();
};

initUserStore();

export default useUserStore;
