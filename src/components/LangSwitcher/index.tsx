import useLanguageStore from "@/stores/languageStore";
import { Language } from "@/types/context";
import IconParkOutlineChineseOne from "~icons/icon-park-outline/chinese-one";
import IconParkOutlineEnglish from "~icons/icon-park-outline/english";

interface LangSwitcherProps {
  showText?: boolean;
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({ showText = false }) => {
  const { language, toggleLanguage } = useLanguageStore();
  const Icon =
    language === Language.EN
      ? IconParkOutlineChineseOne
      : IconParkOutlineEnglish;

  return (
    <div
      className="flex items-center gap-2 cursor-pointer w-full"
      onClick={toggleLanguage}
    >
      <Icon />
      {showText && (
        <span className="w-full">
          {language === Language.EN ? "中文" : "English"}
        </span>
      )}
    </div>
  );
};

export default LangSwitcher;
