import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoadingProps {
  className?: string;
}
export default function Loading({ className }: LoadingProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "z-10 h-screen flex items-center justify-center",
        className
      )}
    >
      <LoaderCircle className="animate-spin icon mr-2" />
      {`${t("Loading")}...`}
    </div>
  );
}
