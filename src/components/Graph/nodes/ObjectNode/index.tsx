import {
  globalStyle,
  computeSourceHandleOffset,
  genValueAttrs,
} from "@/lib/graph/layout";
import { NodeWithData } from "@/lib/graph/types";
import { rootMarker } from "@/lib/idgen";
import { getChildrenKeys, hasChildren } from "@/lib/parser";
import { useTree } from "@/stores/treeStore";
import { useReactFlow, Handle, Position } from "@xyflow/react";
import { NodeProps } from "@xyflow/system";
import { filter } from "lodash-es";
import { memo } from "react";
import Toolbar from "../../Toolbar";
import TargetHandle from "../../handles/TargetHandle";
import KVNode from "../KVNode";

const ObjectNode: React.FC<NodeProps<NodeWithData>> = memo(({ id, data }) => {
  const { getNode } = useReactFlow();
  const tree = useTree();
  const node = tree.node(id);
  const flowNode = getNode(id) as NodeWithData | undefined;

  if (!node || !flowNode) {
    return null;
  }

  const width = flowNode.data.width;
  const childrenNum = getChildrenKeys(node).length;
  const { kvStart, kvEnd, virtualHandleIndices } = flowNode.data.render;

  return (
    <>
      {data.toolbarVisible && <Toolbar id={id} />}
      <div
        className="graph-node nodrag nopan cursor-default"
        role="treeitem"
        aria-selected={data.selected}
        data-tree-id={id}
        style={data.style}
      >
        {node.id !== rootMarker && <TargetHandle childrenNum={childrenNum} />}
        {kvStart > 0 && (
          <div style={{ width, height: kvStart * globalStyle.kvHeight }} />
        )}
        {filter(
          tree.mapChildren(node, (child, key, i) => {
            if (virtualHandleIndices?.[i]) {
              return (
                <Handle
                  key={i}
                  type="source"
                  isConnectable
                  id={key}
                  position={Position.Right}
                  style={{ top: computeSourceHandleOffset(i) }}
                />
              );
            } else if (kvStart <= i && i < kvEnd) {
              const { className, text } = genValueAttrs(child);
              return (
                <KVNode
                  id={child.id}
                  key={i}
                  index={i}
                  property={node.type === "array" ? i : key}
                  valueClassName={className}
                  valueText={text}
                  hasChildren={hasChildren(child)}
                  isChildrenHidden={getNode(child.id)?.hidden ?? false}
                  width={width}
                />
              );
            } else {
              return null;
            }
          })
        )}
        {childrenNum > kvEnd && (
          <div
            style={{
              width,
              height: (childrenNum - kvEnd) * globalStyle.kvHeight,
            }}
          />
        )}
      </div>
    </>
  );
});

export default ObjectNode;
