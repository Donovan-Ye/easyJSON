import { useEditor } from "@/stores/editorStore";
import useUserStore from "@/stores/userStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
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
      console.log("main", main);
      Object.entries(globalShortcut).forEach(([_, value]) => {
        if (value.enabled && value.shortcut) {
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
      unregisterAll();
    };
  }, [JSON.stringify(globalShortcut), main]);
};

export default useGlobalShortcut;
