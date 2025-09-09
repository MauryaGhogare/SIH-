import { create } from "zustand";

export const useLanguage = create((set) => ({
  language: "Eng",
  setLanguage: (lan) => {
    set({ language: lan });
  }
}));