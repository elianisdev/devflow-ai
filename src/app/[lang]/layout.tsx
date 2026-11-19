import type { Metadata } from "next";
import { Instrument_Sans, Martian_Mono } from "next/font/google";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import { defaultLocale, locales } from "@/lib/i18n";
import "../globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [locale, { metadata }] = await Promise.all([getLocale(), getDictionary()]);

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((lang) => [lang, `/${lang}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${instrumentSans.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 font-sans text-body text-neutral-900">
        {children}
      </body>
    </html>
  );
}
