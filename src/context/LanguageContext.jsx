"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Import translations
import en from "@/locales/en.json";
import bn from "@/locales/bn.json";

const translations = { en, bn };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState("en");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    setIsLoaded(true);
    try {
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
          setLanguageState(savedLanguage);
          // Apply Bengali font on initial load if Bengali was saved
          if (savedLanguage === "bn") {
            document.body.classList.add("font-bengali");
          }
        }
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  }, []);

  // Save language preference to localStorage
  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("language", lang);
        // Update document language attribute
        document.documentElement.lang = lang === "bn" ? "bn" : "en";
        // Apply Bengali font globally when Bengali is selected
        if (lang === "bn") {
          document.body.classList.add("font-bengali");
        } else {
          document.body.classList.remove("font-bengali");
        }
      }
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  }, []);

  // Translation function with nested key support (e.g., "navbar.home")
  const t = useCallback(
    (key, fallback = "") => {
      const keys = key.split(".");
      let result = translations[language];

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          // Fallback to English if key not found in current language
          let enResult = translations.en;
          for (const enK of keys) {
            if (enResult && typeof enResult === "object" && enK in enResult) {
              enResult = enResult[enK];
            } else {
              return fallback || key;
            }
          }
          return typeof enResult === "string" ? enResult : fallback || key;
        }
      }

      return (typeof result === "string" || Array.isArray(result) || (result && typeof result === "object")) ? result : fallback || key;
    },
    [language]
  );

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "bn" : "en");
  }, [language, setLanguage]);

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage,
    isLoaded,
    isBengali: language === "bn",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
