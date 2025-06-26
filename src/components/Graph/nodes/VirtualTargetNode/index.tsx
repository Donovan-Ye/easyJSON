import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

const VirtualTargetNode: React.FC = memo(() => {
  return (
    <div className="w-[1px] h-[1px]">
      <Handle type={"target"} isConnectable position={Position.Left} />
    </div>
  );
});

export default VirtualTargetNode;
