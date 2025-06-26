import { genValueAttrs } from "@/lib/graph/layout";
import { NodeWithData } from "@/lib/graph/types";
import { useTree } from "@/stores/treeStore";
import { NodeProps } from "@xyflow/system";
import { memo } from "react";

const RootNode: React.FC<NodeProps<NodeWithData>> = memo(({ id, data }) => {
  const tree = useTree();
  const node = tree.root();

  if (!node) {
    return null;
  }

  const { className, text } = genValueAttrs(node);

  return (
    <div
      className="graph-node"
      style={data.style}
      role="treeitem"
      aria-selected={data.selected}
      data-tree-id={id}
    >
      <div className="graph-kv">
        <div className={className}>{text}</div>
      </div>
    </div>
  );
});

export default RootNode;
