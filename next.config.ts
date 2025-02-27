import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";
const repoName = "song-list-linca-tojou";
const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // ✅ 静的サイト化
  images: { unoptimized: true }, // ✅ GitHub Pages は画像最適化ができないため無効化
  trailingSlash: true, // ✅ URL の末尾に `/` を追加（GitHub Pages 互換）
  basePath: isProd ? `/${repoName}` : "", // ✅ 本番のみ basePath 設定
  assetPrefix: isProd ? `/${repoName}/` : "", // ✅ CSS/JS のパスを修正
};

export default nextConfig;
