import { useStatusStore } from "@/stores/statusStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { LEFT_PANEL_ID, RIGHT_PANEL_ID } from "../constants";

function useObserveResize() {
  const { setLeftPanelWidth, setRightPanelWidth } = useStatusStore(
    useShallow((state) => ({
      setLeftPanelWidth: state.setLeftPanelWidth,
      setRightPanelWidth: state.setRightPanelWidth,
    }))
  );

  useEffect(() => {
    const leftPanel = document.getElementById(LEFT_PANEL_ID)!;
    const rightPanel = document.getElementById(RIGHT_PANEL_ID)!;
    setLeftPanelWidth(leftPanel.offsetWidth);
    setRightPanelWidth(rightPanel.offsetWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.id === LEFT_PANEL_ID) {
          setLeftPanelWidth(entry.contentRect.width);
        } else {
          setRightPanelWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(leftPanel);
    resizeObserver.observe(rightPanel);
  }, []);
}

export default useObserveResize;
