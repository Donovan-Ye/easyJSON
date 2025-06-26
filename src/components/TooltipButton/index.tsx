import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button, ButtonProps } from "../ui/button";

type TooltipButtonProps = ButtonProps & {
  tooltipContent?: React.ReactNode;
};
const TooltipButton: React.FC<React.PropsWithChildren<TooltipButtonProps>> = ({
  tooltipContent,
  children,
  ...props
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="flex flex-col gap-1 items-center justify-center"
      >
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipButton;
