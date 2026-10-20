import localFont from "next/font/local";

// Self-hosted font files, each with its SIL Open Font License beside it.

// Headings, window titles, short buttons and desk labels.
export const pixelify = localFont({
  src: "./pixelify-sans/PixelifySans-Variable-latin.woff2",
  weight: "400 700",
  variable: "--font-pixel",
  display: "swap",
  adjustFontFallback: false,
});

// Navigation, labels and body text.
export const geistMono = localFont({
  src: "./geist-mono/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
  adjustFontFallback: false,
});

// Fallback for Thai song titles; only used for Thai characters.
export const notoThai = localFont({
  src: [
    { path: "./noto-sans-thai/NotoSansThai-400-thai.woff2", weight: "400" },
    { path: "./noto-sans-thai/NotoSansThai-600-thai.woff2", weight: "600" },
  ],
  variable: "--font-thai",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0E01-0E5B, U+200C-200D, U+25CC" }],
});
