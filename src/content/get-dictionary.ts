import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/types/dictionary";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((module) => module.en),
  es: () => import("./dictionaries/es").then((module) => module.es),
};

export const getLocale = async (): Promise<Locale> => {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return locale;
};

export const getDictionary = async (): Promise<Dictionary> =>
  dictionaries[await getLocale()]();
