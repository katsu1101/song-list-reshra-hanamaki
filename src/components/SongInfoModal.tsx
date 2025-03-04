import {Song}                from "@/types";
import React, { useRef, useEffect } from "react";

const SongInfoModal: React.FC<{ song: Song; onClose: () => void }> = ({ song, onClose }) => {
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
      <div ref={infoRef} className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          ♪ {song.title}
        </h2>

        {/* 詳細情報テーブル */}
        <table className="w-full border-collapse">
          <tbody>
          {song.info?.release && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">リリース日</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.release}</td>
            </tr>
          )}
          {song.info?.album && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">アルバム</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.album}</td>
            </tr>
          )}
          {song.info?.genre && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">ジャンル</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.genre}</td>
            </tr>
          )}
          {song.info?.lyricist && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">作詞</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.lyricist}</td>
            </tr>
          )}
          {song.info?.composer && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">作曲</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.composer}</td>
            </tr>
          )}
          {song.info?.arranger && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">編曲</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.arranger}</td>
            </tr>
          )}
          {song.info?.work && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">作品名</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.work}</td>
            </tr>
          )}
          {song.info?.opEd && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">OP/ED区分</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.opEd}</td>
            </tr>
          )}
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

export default SongInfoModal;
