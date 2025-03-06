import GenreBadge                  from "@/components/GenreBadge";
import OpEdBadge                            from "@/components/OpEdBadge";
import SongInfoModal from "@/components/SongInfoModal";
import { Song, YouTubeVideo}          from "@/types";
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image"

type Props = {
  videoData: YouTubeVideo;
  songs: Song[];
  handleGenreClick: (tag: string) => void; // ✅ クリック時にジャンルを渡せる
  handleTextSearch: (q: string) => void; // ✅ クリック時に検索文字列を渡せる
};

const VideoCard: React.FC<Props> = ({ videoData, songs, handleGenreClick, handleTextSearch }) => {
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // クリック外で閉じる処理
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

  if (!videoData) return <></>;

  const isSingingVideo = songs[0]?.source === 1;

  return (
    <div
      className={`p-4 border rounded-lg shadow-md transition-transform duration-300 
        ${isSingingVideo ? "bg-gray-300 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-900 border-blue-500"}`}
    >
      <a
        href={`https://www.youtube.com/watch?v=${videoData.id}&t=0s`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={videoData?.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg`}
          alt={videoData?.snippet?.title || songs[0]?.title}
          className="w-full object-cover rounded-md"
          style={{ height: "14rem" }} // h-48(12rem) or h-32(8rem)
          width={960}
          height={720}
          loading="lazy"
        />
      </a>

      {/* 🎥 動画タイトルの表示 */}
      {videoData?.snippet?.title && (
        <p className="mt-2 text-center font-semibold text-lg text-gray-900 dark:text-gray-100">
          {videoData.snippet.title}
        </p>
      )}

      {/* 曲情報の表示 */}
      <div className="mt-2">
        <ul className={isSingingVideo ? "" : "space-y-2"}>
          {songs.map((song, index) => (
            <li
              key={song.timestamp || index}
              className={`text-lg space-x-2 ${!isSingingVideo ? "border-t border-gray-400 pt-2" : ""}`}
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

                <GenreBadge genre={song.info?.genre} onClick={handleGenreClick} />
                <OpEdBadge opEd={song.info?.opEd || ""} onClick={handleGenreClick} />
              </span>

              {/* 歌の詳細情報（モーダル風） */}
              {openInfo === song.title && (
                <SongInfoModal song={song} onClose={() => setOpenInfo(null)} onTextSearch={handleTextSearch} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoCard;