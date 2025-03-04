import GenreBadge                  from "@/components/GenreBadge";
import OpEdBadge                            from "@/components/OpEdBadge";
import SongInfoModal from "@/components/SongInfoModal";
import { Song, YouTubeVideo}          from "@/types";
import React, {useEffect, useRef, useState} from "react";

type Props = {
  videoData: YouTubeVideo;
  songs: Song[];
  handleGenreClick: (tag: string) => void; // ✅ クリック時にジャンルを渡せる
};

// 1: 歌ってみた動画,
const SingingVideoCard: React.FC<Props> = ({ videoData, songs, handleGenreClick }) => {
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenInfo(null);
    };
    if (openInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openInfo]);

  return <div
    className={`p-4 border rounded-lg shadow-md transition-transform duration-300 ${
      "bg-gray-300 dark:bg-gray-700"}`}
  >
    <a
      href={`https://www.youtube.com/watch?v=${videoData.id}&t=0s`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={videoData?.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg`}
        alt={videoData?.snippet?.title || songs[0].title}
        className={`w-full object-cover rounded-md h-48`}
      />
    </a>

    {/* 🎥 動画タイトルの表示 */}
    {videoData?.snippet?.title && (
      <p className="mt-2 text-center  font-semibold text-lg text-gray-900 dark:text-gray-100">
        {videoData.snippet.title}
      </p>
    )}
    <p className="mt-2 font-medium text-lg flex flex-wrap items-start  space-x-2 text-gray-900 dark:text-gray-100">
      <span>
        {/* ℹ️ Info ボタン */}
        <button
          className="ml-2 px-2 pl-0 py-1 text-sm text-white rounded-md hover:bg-blue-700 focus:outline-none"
          onClick={() => setOpenInfo(songs[0].title)}
        >
          ℹ️
        </button>
        {songs[0].title}

        <GenreBadge
          genre={songs[0].info?.genre}
          onClick={handleGenreClick}
        />
        <OpEdBadge
          opEd={songs[0].info?.opEd || ""}
          onClick={handleGenreClick}
        />
      </span>
    </p>
    {/* 歌の詳細情報（モーダル風） */}
    {openInfo === songs[0].title && (
      <SongInfoModal
        song={songs.find((s) => s.title === openInfo)!}
        onClose={() => setOpenInfo(null)} // ✅ モーダルを閉じる処理を渡す
      />
    )}

  </div>
}

// 2: 配信
const LiveStreamCard: React.FC<Props> = ({ videoData, songs, handleGenreClick }) => {
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setOpenInfo(null);
      }
    };
    if (openInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openInfo]);

  return <div className="p-4 border rounded-lg shadow-md transition-transform duration-300
      bg-blue-100 dark:bg-blue-900 border-blue-500">{/*} hover:scale-105 スマホで悪さをするのでNG */}
    <a
      href={`https://www.youtube.com/watch?v=${videoData.id}&t=0s`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={videoData?.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg`}
        alt={videoData?.snippet?.title || songs[0].title}
        className={`w-full object-cover rounded-md h-32`}
      />
    </a>

    {/* 🎥 動画タイトルの表示 */}
    {videoData?.snippet?.title &&
      <p className="mt-2 text-center font-semibold text-lg text-gray-900 dark:text-gray-100">
        {videoData.snippet.title}
      </p>
    }

    <div className="mt-2">
      <ul className="mt-2 space-y-2 text-gray-800 dark:text-gray-300">
        {songs.map((song) => {
          return <li key={song.timestamp} className="m-0 text-lg space-x-2"
                     style={{ borderTop: "0.5px solid rgba(100, 100, 100, 0.75)" }}
          >
            <span className="flex-nowrap items-start">
            {/* ℹ️ Info ボタン */}
            <button
              className="ml-2 px-2 pl-0 py-1 text-sm text-white rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={() => setOpenInfo(openInfo === song.title ? null : song.title)}
            >
              ℹ️
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${song.videoId}${song.timestamp ? `&t=${song.timestamp}s` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500"
            >
               {song.title}
            </a>

            <GenreBadge
              genre={song.info?.genre}
              onClick={handleGenreClick}
            />
            <OpEdBadge
              opEd={song.info?.opEd || ""}
              onClick={handleGenreClick}
            />
            </span>

            {/* 歌の詳細情報（モーダル風） */}
            {openInfo === song.title && (
              <SongInfoModal
                song={songs.find((s) => s.title === openInfo)!}
                onClose={() => setOpenInfo(null)} // ✅ モーダルを閉じる処理を渡す
              />
            )}
          </li>
        })}
      </ul>
    </div>
  </div>
}

const VideoCard: React.FC<Props> = ({ videoData, songs, handleGenreClick }) => {
  return songs[0]?.source === 1
    ? <SingingVideoCard videoData={videoData} songs={songs} handleGenreClick={handleGenreClick} />
    : <LiveStreamCard videoData={videoData} songs={songs} handleGenreClick={handleGenreClick} />
}

export default VideoCard;