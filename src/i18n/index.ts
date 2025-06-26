import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ENtranslation from "./recourses/en/translation.json";
import zhHanstranslation from "./recourses/zh/translation.json";

const resources = {
  zh: {
    translation: zhHanstranslation,
  },
  en: {
    translation: ENtranslation,
  },
};

i18n.use(initReactI18next).init({
  lng:
    localStorage.getItem("language") ||
    (navigator.language === "zh-CN" ? "zh" : "en"),
  resources,
});

export default i18n;
