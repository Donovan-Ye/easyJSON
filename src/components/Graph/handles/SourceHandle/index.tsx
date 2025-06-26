import { computeSourceHandleOffset } from "@/lib/graph/layout";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

interface SourceHandleProps {
  id: string;
  indexInParent: number;
  isChildrenHidden?: boolean;
}

const SourceHandle: React.FC<SourceHandleProps> = memo(
  ({ id, indexInParent, isChildrenHidden }: SourceHandleProps) => {
    const top =
      indexInParent !== undefined
        ? computeSourceHandleOffset(indexInParent)
        : undefined;
    const backgroundColor = isChildrenHidden ? "rgb(156 163 175)" : undefined;
    return (
      <Handle
        type="source"
        isConnectable
        id={id}
        position={Position.Right}
        style={{ top, backgroundColor }}
      />
    );
  }
);

export default SourceHandle;
