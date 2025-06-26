import LangSwitcher from "@/components/LangSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import TooltipButton from "@/components/TooltipButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { EditorTab, EditorTabOptions } from "@/types/context";
import { useTranslation } from "react-i18next";
import UserDropdownMenu from "./UserDropdownMenu";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { tab, setTab } = useEditorStore();

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "px-2 py-1 shadow dark:shadow-gray-950"
      )}
    >
      <UserDropdownMenu />

      <Tabs value={tab} onValueChange={(value) => setTab(value as EditorTab)}>
        <TabsList>
          {EditorTabOptions.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="p-0">
              <TooltipButton
                variant="ghost"
                size="sm"
                className="w-full"
                bindShortcut={tab.shortcut}
                onClick={() => {
                  setTab(tab.value);
                }}
                listenShift
                tooltipContent={
                  <>
                    <p>{t(tab.value)}</p>

                    <p>{`ctrl + shift + ${tab.shortcut}`}</p>
                  </>
                }
              >
                <tab.Icon />
              </TooltipButton>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex justify-center items-center gap-2">
        <LangSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Header;
