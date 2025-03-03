"use client";

import VideoCard                      from "@/components/VideoCard";
import {Song, SongInfo, YouTubeVideo} from "@/types";
import { useEffect, useState }               from "react";
import Papa                           from "papaparse";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<Record<string, YouTubeVideo>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [songInfoMap, setSongInfoMap] = useState<Record<string, SongInfo> | null>(null);
  const [isScrolled, setIsScrolled] = useState(false); // スクロールの位置
  const [isClient, setIsClient] = useState(false);

  // ✅ クリック時に検索バーへジャンルをセット
  const handleGenreClick = (tag: string) => {
    setSearchQuery("#" + tag);
  };

  const smoothScrollToTop = () => {
    const scrollStep = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 0) {
        window.scrollTo(0, currentScroll - currentScroll / 5); // 速度調整
        requestAnimationFrame(scrollStep);
      }
    };
    requestAnimationFrame(scrollStep);
  };

  // 検索をリセット
  const handleResetSearch = () => {
    smoothScrollToTop(); // 🔝 なめらかにスクロール
    setSearchQuery(""); // 🔍 検索をリセット
  };

  useEffect(() => {
    const fetchSongInfo = async () => {
      try {
        const res = await fetch(`${basePath}/songinfo.csv`);
        const csvText = await res.text();
        const { data }: { data: SongInfo[] } = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const songInfoObj: Record<string, SongInfo> = {};
        data.forEach((info) => {
          songInfoObj[info.title] = info;
        });

        setSongInfoMap(songInfoObj);
      } catch (error) {
        console.error("Failed to load songinfo.csv:", error);
      }
    };

    fetchSongInfo();
  }, []);

  useEffect(() => {
    if (!songInfoMap) return;
    const fetchSongs = async () => {

      try {
        const res = await fetch(`${basePath}/songs.json`);
        const data = await res.json();

        const sortedSongs = [...data.songs].sort((a: Song, b: Song) => {
          if (a.date !== b.date) {
            return b.date.localeCompare(a.date);
          }
          return (a.timestamp || 0) - (b.timestamp || 0);
        });
        const songsWithInfo = sortedSongs.map((song) => ({
          ...song,
          info: songInfoMap[song.title] || null,
        }));

        setSongs(songsWithInfo);
        setVideos(data.videos || {});
      } catch (error) {
        console.error("Failed to load songs.json:", error);
      }
    };

    fetchSongs();
  }, [songInfoMap]);

  useEffect(() => {
    setIsClient(true); // クライアント側でのみ `true` にする
    // クライアントサイドでのみ実行
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredSongs = songs.filter((song) => {
    const videoData = videos[song.videoId];

    // 🔹「#」で始まる場合はジャンル & opEd の完全一致検索
    if (searchQuery.startsWith("#")) {
      const query = searchQuery.slice(1).toLowerCase(); // 先頭の「#」を削除
      return (
        (song.info?.genre?.toLowerCase() === query) || // ✅ ジャンル完全一致
        (song.info?.opEd?.toLowerCase() === query) // ✅ opEd完全一致
      );
    }

    // 🔹それ以外の場合は通常の部分一致検索
    return (
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  // 曲名検索
      song.date.includes(searchQuery) ||  // 日付検索
      (videoData?.snippet?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) // 動画タイトル検索
    );
  });

  // ✅ 日付ごとにグループ化（videoIdごと）
  const groupedSongs: Record<string, Record<string, Song[]>> = {};
  filteredSongs.forEach((song) => {
    if (!groupedSongs[song.date]) {
      groupedSongs[song.date] = {};
    }
    if (!groupedSongs[song.date][song.videoId]) {
      groupedSongs[song.date][song.videoId] = [];
    }
    groupedSongs[song.date][song.videoId].push(song);
  });

  if (!isClient) {
    return <div>Loading...</div>; // SSR時に一旦「Loading...」を表示
  }

  return (
    <main className="max-w-4xl mx-auto p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
      {/* 固定ヘッダー */}
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md p-0">
        <div className="max-w-4xl mx-auto flex flex-col items-center transition-all">
          {/* タイトル（スクロール時に消える） */}
          <h1
            className={`text-2xl font-bold text-center transition-opacity duration-300 opacity-0 ${
              isScrolled ? "opacity-0 h-0" : "opacity-100 h-auto"
            }`}
          >
            戸定梨香ちゃんの歌リスト
          </h1>

          <div className="max-w-4xl mx-auto flex items-center w-full z-[999] p-0">
             {/*左上のアイコン */}
            <div className="mr-2 h-full p-1 cursor-pointer" onClick={handleResetSearch}>
              <img src="/icon-192x192.png" alt="Logo" className="w-12 h-12" />
            </div>

            {/* 検索バー（中央配置） */}
            <div className="flex-1 relative pr-3">
              <input
                type="text"
                placeholder="曲名・日付・動画タイトルで検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-md
                dark:bg-gray-800 dark:text-gray-100"
              />
              {/* 検索リセットボタン（×ボタン） */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
      {Object.entries(groupedSongs).length == 0
        ? <p className="text-center text-gray-500">検索結果がありません</p>
        : Object.entries(groupedSongs).map(([date, videosByDate]) => (
          <section key={date} className="mb-8">
            <h2 className="text-2xl font-semibold border-b-2 pb-2">{date}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.entries(videosByDate).map(([videoId, songs]) => {
                return (
                  <VideoCard
                    key={videoId} videoData={videos[videoId]} songs={songs}
                    handleGenreClick={handleGenreClick}
                  />
                );
              })}
            </div>
          </section>
        ))
      }
      </div>
    </main>
  );
}
