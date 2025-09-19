import { useTranslation } from "react-i18next";

const useLanguage = () => {
  const { i18n } = useTranslation();
  const language =
    {
      tw: "zh-TW",
      en: "en-US",
    }[i18n.language] || "en-US";

  return { language };
};

export default useLanguage;
