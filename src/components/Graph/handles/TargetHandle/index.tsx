import { computeTargetHandleOffset } from "@/lib/graph/layout";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

interface TargetHandleProps {
  childrenNum: number;
}

const TargetHandle: React.FC<TargetHandleProps> = memo(({ childrenNum }) => {
  const top = computeTargetHandleOffset(childrenNum);
  return (
    <Handle
      type="target"
      isConnectable
      position={Position.Left}
      style={{ top }}
    />
  );
});

export default TargetHandle;
