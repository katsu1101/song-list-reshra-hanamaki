export function formatDuration(isoDuration: string): string {
  // ISO8601形式の "PT#H#M#S" を正規表現で抽出
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return isoDuration; // マッチしなかった場合はそのまま返す

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  let result = "";
  if (hours > 0) result += `${hours}時間`;
  if (minutes > 0) result += `${minutes}分`;
  if (seconds > 0) result += `${seconds}秒`;

  return result || "0秒";
}