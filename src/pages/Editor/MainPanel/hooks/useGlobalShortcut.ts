import { useEditor } from "@/stores/editorStore";
import useUserStore, { GlobalShortcutKey } from "@/stores/userStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { getCurrentWindow } from "@tauri-apps/api/window";

const useGlobalShortcut = () => {
  const main = useEditor("main");
  const { globalShortcut } = useUserStore(
    useShallow((state) => ({
      globalShortcut: state.settings.globalShortcut,
    }))
  );

  useEffect(() => {
    if (main) {
      Object.entries(globalShortcut).forEach(([key, value]) => {
        if (key === GlobalShortcutKey.OpenAndPaste && value.enabled && value.shortcut) {
          register(value.shortcut, async () => {
            const text = await readText();
            const window = getCurrentWindow();
            window.show();
            window.setFocus();
            await main.parseAndSet(text, { format: true });
          });
        }
      });
    }

    return () => {
      unregister(Object.values(globalShortcut).map((value) => value.shortcut));
    };
  }, [JSON.stringify(globalShortcut), main]);
};

export default useGlobalShortcut;
