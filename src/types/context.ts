import IconamoonScreenFullBold from "~icons/iconamoon/screen-full-bold";
import LucideWaypoints from "~icons/lucide/waypoints";
import IconamoonCompareBold from "~icons/iconamoon/compare-bold";

export enum EditorTab {
  SINGLE = "Single",
  GRAPH = "Graph",
  COMPARE = "Compare",
}

interface EditorTabOption {
  value: EditorTab;
  Icon: React.FC;
  shortcut?: string;
}
export const EditorTabOptions: EditorTabOption[] = [
  { value: EditorTab.SINGLE, Icon: IconamoonScreenFullBold, shortcut: "u" },
  { value: EditorTab.GRAPH, Icon: LucideWaypoints, shortcut: "i" },
  { value: EditorTab.COMPARE, Icon: IconamoonCompareBold, shortcut: "o" },
];

export enum Theme {
  LIGHT = "Light",
  DARK = "Dark",
}

export enum Language {
  EN = "en",
  ZH = "zh",
}
