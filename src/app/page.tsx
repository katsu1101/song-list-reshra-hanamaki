"use client";

import {checkVersionAndUpdateCache}      from "@/lib/versionChecker";
import { Song, SongsList, YouTubeVideo } from "@/types";
import { useEffect, useState }           from "react";

export default function Home() {
  const [songs, setSongs] = useState<SongsList>([]);
  const [videos, setVideos] = useState<Record<string, YouTubeVideo>>({});
  const [searchQuery, setSearchQuery] = useState<string>(""); // 🔍 検索ワード

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  useEffect(() => {
    checkVersionAndUpdateCache().then(r => {
      console.log("checkVersionAndUpdateCache()", r);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${basePath}/sw.js`).then(() => {
        console.log("Service Worker registered.");
      });
    }
  }, []);
  useEffect(() => {
    fetch(`${basePath}/songs.json`)
      .then((res) => res.json())
      .then((data) => {
        const sortedSongs = [...data.songs].sort((a: Song, b: Song) => {
          if (a.date !== b.date) {
            return b.date.localeCompare(a.date); // `date` の降順（新しい日付を上）
          }
          return (a.timestamp || 0) - (b.timestamp || 0); // `timestamp` の昇順（時間が早い順）
        });
        setSongs(sortedSongs);
        setVideos(data.videos || {}); // 🎥 動画データをセット
      })
      .catch((error) => console.error("Failed to load songs.json:", error));
  }, []);

  // ✅ フィルタリング（検索ワードが含まれる曲・動画のみ表示）
  const filteredSongs = songs.filter((song) => {
    const videoData = videos[song.videoId];
    return (
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.date.includes(searchQuery) ||
      (videoData?.snippet?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) // 🎥 動画タイトルでも検索可能に
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

  return (
    <main className="max-w-4xl mx-auto p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6">戸定梨香ちゃんの歌リスト</h1>

      {/* 🔍 検索バー */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="曲名・日付・動画タイトルで検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {Object.entries(groupedSongs).length > 0 ? (
        Object.entries(groupedSongs).map(([date, videosByDate]) => (
          <section key={date} className="mb-8">
            <h2 className="text-2xl font-semibold border-b-2 pb-2">{date}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.entries(videosByDate).map(([videoId, songs]) => {
                const videoData = videos[videoId]; // 🎥 `data.videos` から動画情報を取得
                return (
                  <div
                    key={videoId}
                    className={`p-4 border rounded-lg shadow-md transition-transform duration-300 ${
                      songs[0].source === 1
                        ? "bg-gray-300 dark:bg-gray-700 hover:scale-105"
                        : "bg-blue-100 dark:bg-blue-900 hover:scale-105 border-blue-500"
                    }`}
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}&t=0s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={videoData?.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={videoData?.snippet?.title || songs[0].title}
                        className={`w-full object-cover rounded-md ${
                          songs[0].source === 1 ? "h-48" : "h-32"
                        }`}
                      />
                    </a>

                    {/* 🎥 動画タイトルの表示 */}
                    {videoData?.snippet?.title && (
                      <p className="mt-2 text-center font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {videoData.snippet.title}
                      </p>
                    )}

                    {songs[0].source === 1 ? (
                      <p className="mt-2 font-medium text-center text-lg text-gray-900 dark:text-gray-100">
                        ♬ {songs[0].title}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <ul className="mt-2 space-y-2 text-gray-800 dark:text-gray-300">
                          {songs.map((song) => (
                            <li key={song.timestamp} className="text-sm">
                              <a
                                href={`https://www.youtube.com/watch?v=${song.videoId}${song.timestamp ? `&t=${song.timestamp}s` : ""}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:underline hover:text-blue-500"
                              >
                                ♪ {song.title} {song.timestamp ? `(${song.timestamp}s)` : ""}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      ) : (
        <p className="text-center text-gray-500">検索結果がありません</p>
      )}
    </main>
  );
}
