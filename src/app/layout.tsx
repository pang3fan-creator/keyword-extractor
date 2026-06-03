import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import messages from '../../messages/en.json';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: messages.metadata.titleTemplate,
    default: `${messages.metadata.titleDefault} | ${messages.metadata.siteName}`,
  },
  description: messages.metadata.description,
  openGraph: {
    title: messages.metadata.openGraphTitle,
    description: messages.metadata.openGraphDescription,
    url: 'https://extractkeywords.com',
    siteName: messages.metadata.siteName,
    type: 'website',
    images: [
      {
        url: 'https://extractkeywords.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: messages.metadata.openGraphTitle,
    description: messages.metadata.openGraphDescription,
    images: ['https://extractkeywords.com/og-image.png'],
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
      className={`${inter.className} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">{children}</body>
    </html>
  );
}
