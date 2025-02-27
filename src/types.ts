export type Song = {
  date: string;        // 日付（例: "2025/02/23"）
  title: string;       // 曲名
  url: string;         // YouTubeのURL
  videoId: string;     // YouTube動画ID
  timestamp: number;   // 開始時間（秒, 0 の場合は先頭）
  source: number;      // 取得元（1: 単独動画, 2: 配信）
};

export type SongsList = Song[];
