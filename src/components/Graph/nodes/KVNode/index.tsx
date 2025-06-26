import { genKeyText } from "@/lib/graph/layout";
import { cn } from "@/lib/utils";
import { memo } from "react";
import SourceHandle from "../../handles/SourceHandle";
import Popover from "../../Popover";

interface KVProps {
  id: string;
  index: number;
  property: string | number;
  valueClassName: string;
  valueText: string;
  hasChildren: boolean;
  width: number; // used to avoid width jump when viewport changes
  isChildrenHidden: boolean;
}

const KVNode: React.FC<KVProps> = memo(
  ({
    id,
    index,
    property,
    valueClassName,
    valueText,
    hasChildren,
    width,
    isChildrenHidden,
  }) => {
    const keyText = genKeyText(property);
    const keyClass =
      typeof property === "number"
        ? "text-hl-index"
        : keyText
        ? "text-hl-key"
        : "text-hl-empty";

    return (
      <div className="graph-kv" style={{ width }} data-tree-id={id}>
        <Popover width={width} hlClass={keyClass} text={keyText}>
          <div className={cn("graph-k", keyClass)}>{keyText}</div>
        </Popover>
        <Popover width={width} hlClass={valueClassName} text={valueText}>
          <div className={cn("graph-v", valueClassName)}>{valueText}</div>
        </Popover>
        {hasChildren && (
          <SourceHandle
            id={keyText}
            indexInParent={index}
            isChildrenHidden={isChildrenHidden}
          />
        )}
      </div>
    );
  }
);

export default KVNode;
