export type Song = {
  info?: SongInfo;      // 追加情報
  date: string;        // 日付（例: "2025/02/23"）
  title: string;       // 曲名
  url: string;         // YouTubeのURL
  videoId: string;     // YouTube動画ID
  timestamp: number;   // 開始時間（秒, 0 の場合は先頭）
  source: number;      // 取得元（1: 歌ってみた動画, 2: 配信）
};
export type SongsList = Song[];

export type Genre =
  'オリジナル' | 'J-POP' | 'ドラえもん' | 'アニソン' | 'ボカロ' | 'ディズニー' | 'クリスマス' | 'ガンダム' | '市民の歌';

export type SongInfo = {
  title: string;       // 曲名
  release?: string;    // リリース日
  album?: string;      // アルバム名
  genre?: Genre;      // ジャンル
  lyricist?: string;   // 作詞
  composer?: string;   // 作曲
  arranger?: string;   // 編曲
  work?: string;       // 作品名
  opEd?: string;       // OP/ED区分
};

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
