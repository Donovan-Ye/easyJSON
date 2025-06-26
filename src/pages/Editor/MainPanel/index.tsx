import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useEditorStore } from "@/stores/editorStore";
import { EditorTab } from "@/types/context";
import { useEffect, useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn, initLogger } from "@/lib/utils";
import { LEFT_PANEL_ID, RIGHT_PANEL_ID } from "./constants";
import useObserveResize from "./hooks/useObserveResize";
import { useStatusStore } from "@/stores/statusStore";
import { useShallow } from "zustand/shallow";
import WidthMeasure from "./WidthMeasure";
import LeftPanel from "../LeftPanel";
import RightPanel from "../RightPanel";
import useGlobalShortcut from "./hooks/useGlobalShortcut";

initLogger();

const MainPanel: React.FC = () => {
  useObserveResize();
  useGlobalShortcut();

  const { tab } = useEditorStore();
  const {
    rightPanelSize,
    rightPanelCollapsed,
    setRightPanelSize,
    setRightPanelCollapsed,
  } = useStatusStore(
    useShallow((state) => ({
      rightPanelSize: state.rightPanelSize,
      rightPanelCollapsed: state.rightPanelCollapsed,
      setRightPanelSize: state.setRightPanelSize,
      setRightPanelCollapsed: state.setRightPanelCollapsed,
    }))
  );
  const [onDragging, setOnDragging] = useState(false);
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (tab === EditorTab.SINGLE) {
      rightPanelRef.current?.collapse();
    } else {
      rightPanelRef.current?.expand(rightPanelSize);
    }
  }, [tab]);

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(layout) => {
          if (tab !== EditorTab.SINGLE) {
            setRightPanelSize(layout[1]);
          }
        }}
      >
        <ResizablePanel
          id={LEFT_PANEL_ID}
          ref={leftPanelRef}
          collapsible
          defaultSize={100 - rightPanelSize}
        >
          <LeftPanel />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          onDragging={(isDragging) => setOnDragging(isDragging)}
        />
        <ResizablePanel
          id={RIGHT_PANEL_ID}
          ref={rightPanelRef}
          collapsible
          defaultSize={rightPanelCollapsed ? 0 : rightPanelSize}
          onCollapse={() => setRightPanelCollapsed(true)}
          onExpand={() => setRightPanelCollapsed(false)}
          className={cn({
            "transition-all duration-300 ease-in-out": !onDragging,
          })}
        >
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      <WidthMeasure />
    </>
  );
};

export default MainPanel;
