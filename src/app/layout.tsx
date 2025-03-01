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

export const metadata = {
  title: "戸定梨香ちゃんの歌リスト",
  description: "これは 戸定梨香ちゃんの歌リストアプリです",
  openGraph: {
    title: "戸定梨香ちゃんの歌リスト",
    description: "これは 戸定梨香ちゃんの歌リストアプリです",
    type: "website",
    url: "https://katsu1101.github.io/song-list-linca-tojou/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@your_twitter_account",
    creator: "@your_twitter_account",
    title: "戸定梨香ちゃんの歌リスト",
    description: "これは 戸定梨香ちゃんの歌リストアプリです",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <title>{metadata.title}</title>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <meta name="apple-mobile-web-app-title" content={metadata.title}/>
      <link rel="apple-touch-icon" href="/icon-192x192.png"/>
      <meta name="mobile-web-app-capable" content="yes"/>
      <meta name="theme-color" content="#000000"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>
    </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
