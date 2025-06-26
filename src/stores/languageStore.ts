import { Language } from "@/types/context";
import i18next from "i18next";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface LanguageStore {
  language?: Language;
  toggleLanguage: () => void;
}

const useLanguageStore = create(
  subscribeWithSelector<LanguageStore>((set) => ({
    toggleLanguage: () =>
      set((state) => ({
        language: state.language === Language.EN ? Language.ZH : Language.EN,
      })),
  }))
);

setTimeout(() => {
  useLanguageStore.setState({
    language: i18next.language as Language,
  });
}, 10);

useLanguageStore.subscribe(
  (state) => state.language,
  (language) => {
    i18next.changeLanguage(language);
    localStorage.setItem("language", language ?? Language.ZH);
  }
);

export default useLanguageStore;
