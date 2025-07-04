import { type ParseOptions } from "@/lib/parser";
import { get, set, del, type UseStore, createStore } from "idb-keyval";
import Cookies from "js-cookie";

export const keyName = "config";

export interface Config {
  enableTextCompare: boolean;
  rightPanelSize: number;
  rightPanelCollapsed: boolean;
  parseOptions: ParseOptions;
  formatTabWidth: number;
  prettyFormat: boolean;
  enableSyncScroll: boolean; // the left and right side editors scroll in sync
  isTouchpad?: boolean;
  fixSideNav: boolean;
}

export const defaultConfig: Config = {
  enableTextCompare: false,
  rightPanelSize: 70,
  rightPanelCollapsed: false,
  parseOptions: {
    nest: true,
    format: true,
    prettyMaxWidth: 120,
  },
  formatTabWidth: 2,
  prettyFormat: true,
  enableSyncScroll: true,
  isTouchpad: undefined,
  fixSideNav: false,
};

let globalStore: UseStore | undefined;

export function init() {
  globalStore = createStore("easyJSON", "kv");
}

export async function safeGet(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    if (!globalStore) {
      init();
    }

    return (await get(key, globalStore)) || null;
  } catch (e) {
    if ((e as unknown as Error).name === "InvalidStateError") {
      console.error("InvalidStateError", e);
      return null;
    } else {
      throw e;
    }
  }
}

export async function safeSet(key: string, value: any) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!globalStore) {
      init();
    }

    Cookies.set(key, value, {
      expires: 365,
      path: "/editor",
      sameSite: "strict",
    });
    await set(key, value, globalStore);
  } catch (e) {
    if ((e as unknown as Error).name === "InvalidStateError") {
      console.error("InvalidStateError", e);
    } else {
      throw e;
    }
  }
}

export async function safeDel(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    if (!globalStore) {
      init();
    }

    await del(key, globalStore);
  } catch (e) {
    if ((e as unknown as Error).name === "InvalidStateError") {
      console.error("InvalidStateError", e);
    } else {
      throw e;
    }
  }
}
