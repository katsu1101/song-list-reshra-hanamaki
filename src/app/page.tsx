"use client";

import GenreBadge                     from "@/components/GenreBadge";
import {Genre, Song, SongInfo, YouTubeVideo} from "@/types";
import { useEffect, useState }               from "react";
import Papa                           from "papaparse";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<Record<string, YouTubeVideo>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [songInfoMap, setSongInfoMap] = useState<Record<string, SongInfo> | null>(null);

  // ✅ クリック時に検索バーへジャンルをセット
  const handleGenreClick = (genre: Genre) => {
    setSearchQuery(genre);
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

  const filteredSongs = songs.filter((song) => {
    const videoData = videos[song.videoId];
    return (
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  // 曲名検索
      song.date.includes(searchQuery) ||  // 日付検索
      (videoData?.snippet?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || // 動画タイトル検索
      (song.info?.genre?.toLowerCase() || "").includes(searchQuery.toLowerCase()) // ✅ ジャンル検索追加
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
                      <p className="mt-2 font-medium text-center text-lg flex items-start  space-x-2 text-gray-900 dark:text-gray-100">
                        ♬ {songs[0].title}
                        {songs[0].info?.genre &&
                          <GenreBadge
                            genre={songs[0].info.genre}
                            onClick={handleGenreClick}
                          />
                        }
                      </p>

                    ) : (
                      <div className="mt-2">
                        <ul className="mt-2 space-y-2 text-gray-800 dark:text-gray-300">
                          {songs.map((song) => {
                            return <li key={song.timestamp} className="text-lg flex items-start  space-x-2">
                              <a
                                href={`https://www.youtube.com/watch?v=${song.videoId}${song.timestamp ? `&t=${song.timestamp}s` : ""}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:underline hover:text-blue-500"
                              >
                                ♪ {song.title}
                              </a>
                              {song.info?.genre &&
                                <GenreBadge
                                  genre={song.info.genre}
                                  onClick={handleGenreClick}
                                />
                              }
                            </li>
                          })}
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
