export type Song = {
  date: string;        // 日付（例: "2025/02/23"）
  title: string;       // 曲名
  url: string;         // YouTubeのURL
  videoId: string;     // YouTube動画ID
  timestamp: number;   // 開始時間（秒, 0 の場合は先頭）
  source: number;      // 取得元（1: 単独動画, 2: 配信）
};

export type SongsList = Song[];

// YouTube API のレスポンスデータの型
export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}
