import { type MessageKey } from "@/global";
import { Comparer } from "@/lib/editor/comparer";
import type { Kind, EditorWrapper } from "@/lib/editor/editor";
import { toastErr, toastSucc } from "@/lib/utils";
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  type LucideIcon,
} from "lucide-react";
import { create } from "zustand";
import { getStatusState } from "./statusStore";
import { EditorTab } from "@/types/context";
import { createJSONStorage, persist } from "zustand/middleware";
import { t } from "i18next";

export interface Command {
  id: MessageKey;
  Icon?: LucideIcon;
  hidden?: boolean; // hidden in command bar?
  run: () => void | Promise<void | boolean>;
}

export interface EditorState {
  tab: EditorTab;
  setTab: (tab: EditorTab) => void;

  main?: EditorWrapper;
  secondary?: EditorWrapper;
  comparer?: Comparer;
  commands: Command[];

  runCommand: (id: MessageKey) => void;
  getAnotherEditor: (kind: Kind) => EditorWrapper;
  setEditor: (editor: EditorWrapper) => void;
  isReady: () => boolean;
  compare: () => void;
  resetHighlight: () => void;
  hasDecorations: () => boolean;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      tab: EditorTab.GRAPH,
      setTab: (tab) => set({ tab }),

      commands: [
        {
          id: "format",
          run: async () => {
            const { main } = get();
            const { set } = await main!.parseAndSet(main!.text(), {
              format: true,
            });
            return set;
          },
        },
        {
          id: "minify",
          run: async () => {
            const { main } = get();
            const { parse } = await main!.parseAndSet(main!.text(), {
              format: "minify",
            });
            return parse;
          },
        },
        {
          id: "escape",
          run: async () => {
            const { main } = get();
            const { set } = await main!.parseAndSet(
              await window.worker.escape(main!.text())
            );
            return set;
          },
        },
        {
          id: "unescape",
          run: async () => {
            const { main } = get();
            const { set } = await main!.parseAndSet(
              await window.worker.unescape(main!.text())
            );
            return set;
          },
        },
        {
          id: "sortAsc",
          Icon: ArrowDownNarrowWide,
          run: async () => {
            const { main } = get();
            const { parse } = await main!.parseAndSet(main!.text(), {
              sort: "asc",
            });
            return parse;
          },
        },
        {
          id: "sortDesc",
          Icon: ArrowDownWideNarrow,
          run: async () => {
            const { main } = get();
            const { parse } = await main!.parseAndSet(main!.text(), {
              sort: "desc",
            });
            return parse;
          },
        },
        {
          id: "compare",
          run: async () => await get().compare(),
        },
        {
          id: "swapLeftRight",
          hidden: true,
          run: async () => {
            const { main, secondary } = get();
            const left = main?.text();
            const right = secondary?.text();
            await main?.parseAndSet(right ?? "", {}, false);
            await secondary?.parseAndSet(left ?? "", {}, false);
            return true;
          },
        },
        {
          id: "pythonDictToJSON",
          run: async () => {
            const { main } = get();
            const { parse } = await main!.parseAndSet(await window.worker.pythonDictToJSON(main!.text()));
            return parse;
          },
        },
        {
          id: "show_jq",
          run: () => getStatusState().setCommandMode("jq"),
        },
        {
          id: "show_json_path",
          run: () => getStatusState().setCommandMode("json_path"),
        },
      ],

      async runCommand(id: MessageKey) {
        const { commands, isReady } = get();
        if (!isReady()) {
          console.log("editor is not ready!");
          return;
        }

        const r = await Promise.resolve(
          commands.find((item) => item.id === id)?.run()
        );
        let isSucc = true;

        if (r !== undefined) {
          if (r) {
            toastSucc("cmd_exec_succ");
          } else {
            toastErr("cmd_exec_fail");
            isSucc = false;
          }
        }
      },

      getAnotherEditor(kind: Kind) {
        return (kind === "main" ? get().secondary : get().main)!;
      },

      setEditor(editor: EditorWrapper) {
        let { main, secondary } = get();

        if (editor.kind === "main") {
          main = editor;
        } else {
          secondary = editor;
        }

        set({
          [editor.kind]: editor,
          comparer:
            main && secondary ? new Comparer(main, secondary) : undefined,
        });
      },

      isReady() {
        const { main, secondary } = get();
        return !!(main && secondary);
      },

      async compare() {
        const { comparer } = get();
        const { diffPairs, isTextCompare } = await comparer!.compare();
        const hasDiff = diffPairs.length > 0;

        comparer!.highlightDiff(diffPairs, isTextCompare);

        if (hasDiff) {
          // toastWarn(isTextCompare ? "with_text_diff" : "with_diff", "compare");
        } else {
          toastSucc(t("NoDiff"), "compare");
        }
      },

      hasDecorations() {
        return !!get().comparer?.hasDecorations();
      },

      resetHighlight() {
        get().comparer?.reset();
      },
    }),
    {
      name: "editor-store",
      partialize: (state) => ({
        tab: state.tab,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useEditor(kind: Kind = "main") {
  return useEditorStore((state) => state[kind]);
}

export function getEditorState() {
  return useEditorStore.getState();
}
