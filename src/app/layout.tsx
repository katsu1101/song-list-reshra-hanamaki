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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const metadata = {
  title: "戸定梨香ちゃんの歌リスト",
  metadataBase: new URL("https://katsu1101.github.io/song-list-linca-tojou/"),
  description: "これは 戸定梨香ちゃんの歌リストアプリです",
  openGraph: {
    title: "戸定梨香ちゃんの歌リスト",
    description: "これは 戸定梨香ちゃんの歌リストアプリです",
    type: "website",
    url: "https://katsu1101.github.io/song-list-linca-tojou/",
    images: [
      {
        url: "og-image.png",
        width: 1200,
        height: 630,
        alt: "OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@katsu1101",
    creator: "@katsu1101",
    title: "戸定梨香ちゃんの歌リスト",
    description: "これは 戸定梨香ちゃんの歌リストアプリです",
    images: ["og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
    <head>
      <meta charSet="UTF-8"/>
      <title>戸定梨香ちゃんの歌リスト</title>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <meta name="apple-mobile-web-app-title" content="戸定梨香ちゃんの歌リスト"/>

      <meta name="mobile-web-app-capable" content="yes"/>
      <meta name="theme-color" content="#FF0000"/>
      <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32x32.png`}/>
      <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16x16.png`}/>
      <link rel="manifest" href={`${basePath}/manifest.json`}/>

      <meta property="og:site_name" content="戸定梨香ちゃんの歌リスト"/>
      <meta property="og:locale" content="ja_JP"/>

      <link rel="canonical" href="https://katsu1101.github.io/song-list-linca-tojou/"/>


      {/*<meta name="robots" content="index, follow"/>*/}

      {/*スタートアップ画像*/}
      <link rel="apple-touch-startup-image" href={`${basePath}/apple-touch-icon.png`}/>

      {/*ホーム画面に追加したときのアイコン*/}
      <link rel="shortcut icon" href={`${basePath}/android-chrome-192x192.png`}/>

    </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
