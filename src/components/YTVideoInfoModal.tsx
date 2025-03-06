import {formatDuration}             from "@/lib/youTube";
import {YouTubeVideo}         from "@/types";
import Image                        from "next/image";
import React, { useRef, useEffect } from "react";

type Props = {
  video: YouTubeVideo;
  onClose: () => void
  onTextSearch: (q: string) => void
}
const YTVideoInfoModal: React.FC<Props> = ({ video, onClose }) => {
  const infoRef = useRef<HTMLDivElement>(null);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={infoRef} className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-[24rem] md:w-[48rem]">
        <div className="relative group w-[22rem] md:w-[44rem]">
          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
              dark:text-gray-100
              mb-4
              truncate
            "
          >
            {video.snippet.title}
          </h2>
          <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10 bg-gray-800 text-white text-sm p-2 rounded shadow-lg whitespace-normal">
            {video.snippet.title}
          </div>
        </div>


        <table>
          <tbody>
          <tr>
            <td className="w-[18rem] md:w-[28rem]">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}&t=0s`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={video?.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video?.snippet?.title || ""}
                  className="object-cover rounded-md w-[16rem] md:w-[30rem]"
                  style={{ height: "16rem" }} // h-48(12rem) or h-32(8rem)
                  width={480}
                  height={360}
                  loading="lazy"
                />
              </a>
            </td>
            <td rowSpan={2} className="align-top">
              {/* 詳細情報テーブル */}
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      再生時間
                    </td>
                    <td className="py-2 text-nowrap text-gray-900 dark:text-gray-100">
                      {formatDuration(video.contentDetails.duration)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      再生回数
                    </td>
                    <td className="py-2 text-gray-900 dark:text-gray-100">
                      {video.statistics.viewCount}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      高評価
                    </td>
                    <td className="py-2 text-gray-900 dark:text-gray-100">
                      {video.statistics.likeCount}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      コメント数
                    </td>
                    <td className="py-2 text-gray-900 dark:text-gray-100">
                      {video.statistics.commentCount}
                    </td>
                  </tr>
                  {video.snippet.tags && (<tr>
                    <td colSpan={2} className="py-2 text-gray-900 dark:text-gray-100 align-top">
                      {/* スクロール領域 */}
                      <div className="text-xs max-h-48 overflow-y-auto whitespace-pre-wrap flex flex-wrap gap-2 pr-2">
                        <div className="text-lg font-semibold">タグ</div>
                        {video.snippet.tags.map((tag) => (
                          <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td className="py-2 text-gray-900 dark:text-gray-100 align-top">
              <div className="max-h-32 w-[12rem] md:w-[28rem] overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                {video.snippet.description}
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        {/* 閉じるボタン */}
        <button
          className="mt-4 w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
          onClick={onClose}
        >
          ✖ 閉じる
        </button>
      </div>
    </div>
  );
};

export default YTVideoInfoModal;
