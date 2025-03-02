import { Genre } from "@/types"; // 型定義ファイルをインポート

export const genreColors: Record<Genre, { background: string; color: string, border?: string, boxShadow?: string }> = {
  "オリジナル": { background: "#FFD700", color: "#000000" },  // ゴールド
  "J-POP": { background: "#FF69B4", color: "#FFFFFF" },      // ピンク
  "ドラえもん": {
    background: "#FFFFFF",
    color: "#1E90FF",
    boxShadow: "0 0 5px #FF69B4" // 青のグロー効果
  }, // 青
  "アニソン": { background: "#FF4500", color: "#FFFFFF" },   // オレンジ
  "ボカロ": { background: "#00CED1", color: "#FFFFFF" },     // 青緑
  "ディズニー": { background: "#60B3E7", color: "#D2E6FA" }, // 紫
  "クリスマス": { background: "#008000", color: "#E9423A" }, // 緑
  "ガンダム": {
    background: "#EBF7EE",  // 白
    color: "#E9423A",       // 赤
    border: "2px solid #F9C13A", // 黄色枠
    boxShadow: "0 0 5px #5DA0E7" // 青のグロー効果
  },
};

// ジャンルの色を取得する関数
export const getGenreColors = (genre?: Genre) => {
  return genre ? genreColors[genre] : { background: "#CCCCCC", color: "#000000" }; // デフォルトグレー
};