import { en } from './en';
import { tr } from './tr';

export type Language = 'en' | 'tr';

export const translations = {
  en,
  tr
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  tr: 'Türkçe'
};

export const defaultLanguage: Language = 'en';

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem('app_language');
  if (stored && (stored === 'en' || stored === 'tr')) {
    return stored as Language;
  }
  return defaultLanguage;
}

export function setStoredLanguage(lang: Language): void {
  localStorage.setItem('app_language', lang);
}
