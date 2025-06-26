import { cn } from "@/lib/utils";
import Header from "./Header";
import MainPanel from "./MainPanel";

const Editor: React.FC = () => {
  return (
    <div className={cn("h-full w-full", "flex flex-col")}>
      <Header />

      <MainPanel />
    </div>
  );
};

export default Editor;
