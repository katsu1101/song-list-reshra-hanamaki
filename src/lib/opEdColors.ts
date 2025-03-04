
export const genreColors: Record<string, { background: string; color: string, border?: string, boxShadow?: string }> = {
  "OP": {
    background: "#FFD700", color: "#000000"
  },  // ゴールド
  "主題歌": {
    background: "#FFD700", color: "#000000",
    border: "2px solid #F9C13A", // 黄色枠
    boxShadow: "0 0 5px #5DA0E7" // 青のグロー効果
  },  // ゴールド
  "テーマソング": {
    background: "#FFD700", color: "#000000" ,
    border: "2px solid #F9C13A", // 黄色枠
    boxShadow: "0 0 5px #5DA0E7" // 青のグロー効果
  },  // ゴールド
  "挿入歌": { background: "#FF4500", color: "#FFFFFF" },   // オレンジ
  "キャラソン": { background: "#FF69B4", color: "#FFFFFF" },      // ピンク
  "CMソング": { background: "#00CED1", color: "#FFFFFF",
    border: "2px solid #F9C13A", },     // 青緑
  "イメージソング": { background: "#00CED1", color: "#FFFFFF",
    border: "2px solid #F9C13A", },     // 青緑
  "ED": {
    background: "#FFFFFF",
    color: "#1E90FF"
  }, // 青
};

// ジャンルの色を取得する関数
export const getOpEdColors = (opEd: string) => {
  return genreColors[opEd] || { background: "#CCCCCC", color: "#000000" }; // デフォルトグレー
};