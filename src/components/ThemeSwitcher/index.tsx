import useThemeStore from "@/stores/themeStore";
import { Theme } from "@/types/context";
import { useTranslation } from "react-i18next";
import LineMdMoonFilledAltToSunnyFilledLoopTransition from "~icons/line-md/moon-filled-alt-to-sunny-filled-loop-transition";
import LineMdMoonRisingFilledAltLoop from "~icons/line-md/moon-rising-filled-alt-loop";

interface ThemeSwitcherProps {
  showText?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showText = false }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  const Icon =
    theme === Theme.LIGHT
      ? LineMdMoonRisingFilledAltLoop
      : LineMdMoonFilledAltToSunnyFilledLoopTransition;

  return (
    <div className="flex items-center gap-2">
      <Icon className="cursor-pointer" onClick={toggleTheme} />
      {showText && <span>{t(theme === Theme.LIGHT ? "Dark" : "Light")}</span>}
    </div>
  );
};

export default ThemeSwitcher;
