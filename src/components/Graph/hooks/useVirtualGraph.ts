import { useEffect, useRef } from "react";
import { config, initialViewport } from "@/lib/graph/layout";
import type { EdgeWithData, NodeWithData } from "@/lib/graph/types";
import { useStatusStore } from "@/stores/statusStore";
import { useTreeVersion } from "@/stores/treeStore";
import { useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { XYPosition } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { maxBy } from "lodash-es";
import { useShallow } from "zustand/shallow";
import { EditorTab } from "@/types/context";
import { useEditorStore } from "@/stores/editorStore";

const viewportSize: [number, number] = [0, 0];

export default function useVirtualGraph() {
  const treeVersion = useTreeVersion();
  // nodes and edges are not all that are in the graph, but rather the ones that will be rendered.
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeWithData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeWithData>([]);

  const translateExtentRef = useRef<[[number, number], [number, number]]>([
    [-config.translateMargin, -config.translateMargin],
    [config.translateMargin, config.translateMargin],
  ]);

  const { setViewport, getZoom } = useReactFlow();
  const { isGraphView } = useEditorStore(
    useShallow((state) => ({
      isGraphView: state.tab === EditorTab.GRAPH,
    }))
  );
  const { resetFoldStatus } = useStatusStore(
    useShallow((state) => ({
      resetFoldStatus: state.resetFoldStatus,
    }))
  );

  useEffect(() => {
    if (!(window.worker && isGraphView)) {
      console.l("skip graph render:", isGraphView, treeVersion);
      return;
    }

    (async () => {
      const {
        graph: { levelMeta },
        renderable: { nodes, edges },
      } = await window.worker.createGraph();

      setNodes(nodes);
      setEdges(edges);
      setViewport({ ...initialViewport, zoom: getZoom() });
      resetFoldStatus();

      const [w, h] = viewportSize;
      const px = Math.max(config.translateMargin, w / 2);
      const py = Math.max(config.translateMargin, h / 2);
      const maxX = maxBy<XYPosition>(levelMeta, "x")?.x ?? 0;
      const maxY = maxBy<XYPosition>(levelMeta, "y")?.y ?? 0;

      // fix https://github.com/xyflow/xyflow/issues/3633
      translateExtentRef.current = [
        [-px, -py],
        [maxX + px, maxY + py],
      ];

      console.l(
        "create a new graph:",
        treeVersion,
        translateExtentRef.current,
        nodes.length,
        edges.length,
        nodes.slice(0, 10),
        edges.slice(0, 10)
      );
    })();
  }, [isGraphView, treeVersion]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    translateExtent: translateExtentRef.current,
  };
}

export function setViewportSize(width: number, height: number) {
  if (width) {
    viewportSize[0] = width;
  }
  if (height) {
    viewportSize[1] = height;
  }
}
