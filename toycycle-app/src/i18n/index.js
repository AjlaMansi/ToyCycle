import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  sq: {
    translation: {
      welcome: "Mirë se vini në ToyCycle",
      login: "Hyr",
      register: "Regjistrohu",
      email: "Email",
      password: "Fjalëkalim",
      toys: "Lodrat",
      posts: "Postime",
      benefits: "Përfitimet",
      risks: "Rreziqet",
      skills: "Aftësitë e zhvilluara",
      supervision: "Mbikëqyrja",
      age: "Mosha",
      scan: "Skano",
      profile: "Profili",
      exchange: "Këmbim",
      community: "Komuniteti",
    },
  },
  en: {
    translation: {
      welcome: "Welcome to ToyCycle",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      toys: "Toys",
      benefits: "Benefits",
      risks: "Risks",
      skills: "Skills developed",
      supervision: "Supervision",
      posts: "Posts",
      scan: "Scan",
      age: "Age",
      profile: "Profile",
      exchange: "Exchange",
      community: "Community",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "sq",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
