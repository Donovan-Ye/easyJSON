import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore, { GlobalShortcutKey } from "@/stores/userStore";
import { useTranslation } from "react-i18next";
import SiJsonAlt2Fill from "~icons/si/json-alt-2-fill";
import SwitchLabel from "./SwitchLabel";

const UserDropdownMenu: React.FC = () => {
  const { t } = useTranslation();
  const { settings, setSettings, updateGlobalShortcut, resetGlobalShortcut } =
    useUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SiJsonAlt2Fill className="opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("user.settings")}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSettings({
              ...settings,
              autoPaste: !settings.autoPaste,
            });
          }}
        >
          {t("user.settings.autoPaste")}
          <DropdownMenuShortcut>
            <SwitchLabel checked={settings.autoPaste} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSettings({
              ...settings,
              pythonDictToJSON: !settings.pythonDictToJSON,
            });
          }}
        >
          {t("user.settings.pythonDictToJSON")}
          <DropdownMenuShortcut>
            <SwitchLabel checked={settings.pythonDictToJSON} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            resetGlobalShortcut();
          }}
        >
          {t("user.settings.globalShortcut")}
          <DropdownMenuShortcut>{t("reset")}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateGlobalShortcut(
              GlobalShortcutKey.OpenAndPaste,
              !settings.globalShortcut.openAndPaste.enabled
            );
          }}
        >
          {t("user.settings.globalShortcut.openAndPaste")}
          <DropdownMenuShortcut>
            {settings.globalShortcut.openAndPaste.shortcut}
          </DropdownMenuShortcut>
          <DropdownMenuShortcut>
            <SwitchLabel checked={settings.globalShortcut.openAndPaste.enabled} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
