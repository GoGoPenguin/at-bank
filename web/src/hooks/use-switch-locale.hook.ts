import { useTranslation } from "react-i18next";
import { type Language } from "../enum";

const useSwitchLocale = () => {
  const { i18n } = useTranslation();

  const switchLocale = (locale: Language) => {
    i18n.changeLanguage(locale);
    localStorage.setItem("locale", locale);
  };

  const getCurrentLocale = () => {
    return i18n.language as Language;
  };

  return { switchLocale, getCurrentLocale };
};

export type { Language };

export default useSwitchLocale;
