import Graph from "@/components/Graph";
import MonacoEditor from "@/components/MonacoEditor";
import TabView from "@/components/TabView";
import TooltipButton from "@/components/TooltipButton";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getEditorState, useEditorStore } from "@/stores/editorStore";
import { EditorTab } from "@/types/context";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import IconamoonCompareBold from "~icons/iconamoon/compare-bold";

const DIFF_SHORTCUT = "p";

const RightPanel: React.FC = () => {
  const [diff, setDiff] = useState(false);
  const { tab, hasDecorations, resetHighlight } = useEditorStore(
    useShallow((state) => ({
      tab: state.tab,
      hasDecorations: state.hasDecorations,
      resetHighlight: state.resetHighlight,
    }))
  );

  useEffect(() => {
    setDiff(hasDecorations());
  }, [hasDecorations]);

  return (
    <Tabs value={tab} className="h-full w-full">
      <TabView viewMode={EditorTab.GRAPH}>
        <Graph />
      </TabView>
      <TabView viewMode={EditorTab.COMPARE}>
        <div className="absolute top-2 right-2 flex gap-2 z-50">
          <TooltipButton
            variant="icon"
            size="iconSm"
            className={cn({
              "!bg-blue-100": diff,
            })}
            onClick={() => {
              const newDiff = hasDecorations();
              if (newDiff) {
                resetHighlight();
              } else {
                getEditorState().runCommand("compare");
              }
              setDiff(!newDiff);
            }}
            bindShortcut={DIFF_SHORTCUT}
            listenShift
            tooltipContent={
              <>
                <p>Toggle diff</p>
                <p>{`ctrl + shift + ${DIFF_SHORTCUT}`}</p>
              </>
            }
          >
            <IconamoonCompareBold />
          </TooltipButton>
        </div>

        <MonacoEditor kind="secondary" />
      </TabView>
    </Tabs>
  );
};

export default RightPanel;
