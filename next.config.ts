import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const repoName = "song-list-linca-tojou";

// 🔽 追加: ビルドバージョンを更新する関数
const updateBuildVersion = () => {
  const buildVersionPath = path.join(__dirname, "public", "build-version.json");
  const timestamp = new Date().toISOString();

  fs.writeFileSync(buildVersionPath, JSON.stringify({ version: timestamp }, null, 2));
  console.log(`✅ Build version updated: ${timestamp}`);
};

// 🔽 追加: Next.js のビルド時にバージョンを自動更新
updateBuildVersion();

const nextConfig: NextConfig = {
  output: "export", // ✅ 静的サイト化
  images: { unoptimized: true }, // ✅ GitHub Pages は画像最適化ができないため無効化
  trailingSlash: true, // ✅ URL の末尾に `/` を追加（GitHub Pages 互換）
  basePath: isProd ? `/${repoName}` : "", // ✅ 本番のみ basePath 設定
  assetPrefix: isProd ? `/${repoName}/` : "", // ✅ CSS/JS のパスを修正
  reactStrictMode: true,
  swcMinify: true,
  distDir: "build", // ビルドファイルの出力ディレクトリを変更（オプション）
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development", // 開発環境ではPWAを無効化
  },

  webpack: (config) => {
    // 必要に応じて Webpack のカスタム設定
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
