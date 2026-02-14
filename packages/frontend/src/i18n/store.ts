import { create } from 'zustand';
import { en, type Translations } from './en';
import { ru } from './ru';

export type Locale = 'en' | 'ru';

const locales: Record<Locale, Translations> = { en, ru };

function detectLocale(): Locale {
  const saved = localStorage.getItem('m3m_locale') as Locale | null;
  if (saved && locales[saved]) return saved;
  const nav = navigator.language.slice(0, 2);
  return nav === 'ru' ? 'ru' : 'en';
}

function getNestedValue(obj: any, path: string): string {
  const parts = path.split('.');
  let val = obj;
  for (const p of parts) {
    val = val?.[p];
    if (val === undefined) return path;
  }
  return typeof val === 'string' ? val : path;
}

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  locale: detectLocale(),

  setLocale: (locale: Locale) => {
    localStorage.setItem('m3m_locale', locale);
    set({ locale });
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { locale } = get();
    let text = getNestedValue(locales[locale], key);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  },
}));
