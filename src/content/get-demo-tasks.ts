import type { DemoTask } from "@/content/demo/demo-task";
import type { Locale } from "@/lib/i18n";

const demoTasks: Record<Locale, () => Promise<DemoTask[]>> = {
  en: () => import("./demo/en").then((module) => module.en),
  es: () => import("./demo/es").then((module) => module.es),
};

export const getDemoTasks = (locale: Locale): Promise<DemoTask[]> => demoTasks[locale]();
