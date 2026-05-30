import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ExtractKeywords",
    default: "Free Online Keyword Extraction Tool | ExtractKeywords",
  },
  description:
    "Free online keyword extraction tool. Extract keywords from text or URL instantly. No signup required. Download results as CSV.",
  openGraph: {
    title: "ExtractKeywords — Free Online Keyword Extraction Tool",
    description:
      "Extract keywords from text or URL instantly. No signup required.",
    url: "https://extractkeywords.com",
    siteName: "ExtractKeywords",
    type: "website",
    images: [
      {
        url: "https://extractkeywords.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExtractKeywords — Free Online Keyword Extraction Tool",
    description:
      "Extract keywords from text or URL instantly. No signup required.",
    images: ["https://extractkeywords.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
